import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const REDIRECT_URI = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback` : 'http://localhost:3000/api/auth/facebook/callback';

// Required permissions for FB & IG
const SCOPE = [
  'public_profile',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'instagram_basic',
  'instagram_content_publish'
].join(',');

export async function GET(req: NextRequest) {
  try {
    if (!CLIENT_ID) {
      throw new Error('Facebook OAuth credentials not configured.');
    }

    // Generate random state for security
    const state = Math.random().toString(36).substring(7);
    
    // Construct Facebook OAuth URL
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', SCOPE);
    authUrl.searchParams.set('response_type', 'code');

    // Store state in cookie for verification
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('facebook_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'lax' : 'none') as 'lax' | 'none',
      maxAge: 60 * 10 // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    // Return an error page that works with popups
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Facebook OAuth Error</title></head>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = '/vehicle/new?facebook_error=${encodeURIComponent(errorMessage)}';
              window.close();
            } else {
              window.location.href = '/vehicle/new?facebook_error=${encodeURIComponent(errorMessage)}';
            }
          </script>
        </body>
      </html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
} 