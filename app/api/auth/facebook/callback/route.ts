import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback` : 'http://localhost:3000/api/auth/facebook/callback';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = req.cookies.get('facebook_oauth_state')?.value;

    if (!code || !state || !storedState) {
      throw new Error('Missing OAuth parameters');
    }

    if (state !== storedState) {
      throw new Error('Invalid OAuth state');
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Facebook OAuth credentials not configured');
    }

    // Exchange code for access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Facebook token exchange error:', error);
      throw new Error('Failed to exchange code for access token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    // Get user info to verify token
    const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${access_token}`);
    if (!userResponse.ok) {
      throw new Error('Failed to verify access token');
    }

    const userData = await userResponse.json();
    console.log('Facebook auth successful for user:', userData.id);

    // Set cookies in the response
    const response = new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Facebook Auth Success</title>
          <script>
            function closeWindow() {
              if (window.opener) {
                try {
                  window.opener.postMessage({
                    type: 'facebook_success',
                    data: {
                      accessToken: '${access_token}',
                      userId: '${userData.id}'
                    }
                  }, window.location.origin);
                } catch (e) {
                  console.error('Failed to send message to opener:', e);
                }
                window.close();
              }
            }
            // Call immediately when loaded
            window.onload = closeWindow;
          </script>
        </head>
        <body>
          <p>Authentication successful! You may close this window.</p>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': [
            `facebook_access_token=${access_token}; HttpOnly; Path=/; Max-Age=${expires_in}; SameSite=Lax`,
            'facebook_oauth_state=; Path=/; Max-Age=0'
          ].join(', ')
        }
      }
    );

    return response;

  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Facebook Auth Error</title>
          <script>
            function handleError() {
              if (window.opener) {
                try {
                  window.opener.postMessage({
                    type: 'facebook_error',
                    error: '${errorMessage}'
                  }, window.location.origin);
                } catch (e) {
                  console.error('Failed to send error to opener:', e);
                }
                window.close();
              }
            }
            // Call immediately when loaded
            window.onload = handleError;
          </script>
        </head>
        <body>
          <p>Authentication failed. You may close this window.</p>
        </body>
      </html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
} 