import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, media_id } = body;
    
    if (!text) {
      return NextResponse.json({ error: 'Missing tweet text.' }, { status: 400 });
    }

    // Get the access token from cookies
    const accessToken = req.cookies.get('twitter_access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Twitter OAuth credentials not configured.',
        details: 'Please connect your Twitter account first.'
      }, { status: 401 });
    }

    // Create client with OAuth access token
    const client = new TwitterApi(accessToken);

    // Verify credentials before posting
    try {
      console.log('Verifying Twitter credentials...');
      const user = await client.v2.me();
      console.log('Twitter credentials verified for user:', user.data?.username);
    } catch (authError) {
      console.error('Twitter authentication error:', authError);
      let errorMessage = 'Twitter authentication failed.';
      
      if (authError instanceof Error) {
        if (authError.message.includes('Status: 401')) {
          errorMessage = 'Twitter authentication expired. Please reconnect your account.';
        } else if (authError.message.includes('Status: 403')) {
          errorMessage = 'Twitter API access forbidden. Please verify your account has the required permissions.';
        } else if (authError.message.includes('Status: 429')) {
          errorMessage = 'Twitter rate limit exceeded. Please try again later.';
        }
      }

      return NextResponse.json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(authError) : undefined
      }, { status: 401 });
    }

    const tweetParams = {
      text: text,
      ...(media_id && { media: { media_ids: [media_id] } })
    };

    console.log('Attempting to post tweet:', {
      textLength: text.length,
      hasMedia: !!media_id,
      mediaId: media_id
    });

    try {
      const tweet = await client.v2.tweet(tweetParams);
      
      if (!tweet?.data?.id) {
        console.error('Invalid tweet response:', tweet);
        throw new Error('Invalid response from Twitter API');
      }

      const tweetUrl = `https://twitter.com/i/web/status/${tweet.data.id}`;
      console.log('Tweet posted successfully:', tweetUrl);
      
      return NextResponse.json({ 
        success: true, 
        tweet: tweet.data,
        url: tweetUrl
      });
    } catch (tweetError) {
      console.error('Twitter post error:', tweetError);
      
      let errorMessage = 'Failed to post tweet.';
      let statusCode = 400;

      if (tweetError instanceof Error) {
        if (tweetError.message.includes('Status: 403')) {
          errorMessage = 'Twitter API access forbidden. Please verify that your account has Write permissions enabled.';
        } else if (tweetError.message.includes('Status: 429')) {
          errorMessage = 'Twitter rate limit exceeded. Please try again later.';
          statusCode = 429;
        } else if (tweetError.message.includes('Status: 401')) {
          errorMessage = 'Twitter authentication expired. Please reconnect your account.';
          statusCode = 401;
        } else if (tweetError.message.includes('Status: 400')) {
          errorMessage = 'Invalid tweet content. Please check the text length and media.';
        } else {
          errorMessage = tweetError.message;
        }
      }

      return NextResponse.json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(tweetError) : undefined
      }, { status: statusCode });
    }
  } catch (error) {
    console.error('Unexpected error in Twitter post endpoint:', error);

    return NextResponse.json({ 
      error: 'An unexpected error occurred while posting to Twitter.',
      details: process.env.NODE_ENV === 'development' ? {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      } : undefined
    }, { status: 500 });
  }
} 