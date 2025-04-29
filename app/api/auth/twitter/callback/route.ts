import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/twitter/callback` : 'http://localhost:3000/api/auth/twitter/callback';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  // Get stored state and code verifier from cookies
  const storedState = req.cookies.get('twitter_oauth_state')?.value;
  const codeVerifier = req.cookies.get('twitter_oauth_verifier')?.value;

  const closePopupWithError = (error: string) => {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Twitter Auth Error</title></head>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = '/vehicle/new?twitter_error=${encodeURIComponent(error)}';
              window.close();
            } else {
              window.location.href = '/vehicle/new?twitter_error=${encodeURIComponent(error)}';
            }
          </script>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  };

  if (!code || !state || !storedState || !codeVerifier) {
    return closePopupWithError('Missing OAuth parameters');
  }

  if (state !== storedState) {
    return closePopupWithError('Invalid OAuth state');
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return closePopupWithError('Twitter OAuth credentials not configured');
  }

  try {
    const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
    
    const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: REDIRECT_URI,
    });

    // Create success response that closes popup and updates parent window
    const response = new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Twitter Auth Success</title></head>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = '/vehicle/new?twitter_success=true';
              window.close();
            } else {
              window.location.href = '/vehicle/new?twitter_success=true';
            }
          </script>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );

    // Set the cookies on the response
    const cookies = response.headers.get('Set-Cookie') || '';
    response.headers.set('Set-Cookie', cookies + `;twitter_access_token=${accessToken}; HttpOnly; Path=/; Max-Age=${expiresIn}; SameSite=Lax`);
    
    if (refreshToken) {
      response.headers.set('Set-Cookie', cookies + `;twitter_refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`);
    }

    // Clear the OAuth state cookies
    response.headers.set('Set-Cookie', 'twitter_oauth_state=; Path=/; Max-Age=0');
    response.headers.set('Set-Cookie', 'twitter_oauth_verifier=; Path=/; Max-Age=0');

    return response;
  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    return closePopupWithError('Failed to complete Twitter authentication');
  }
} 