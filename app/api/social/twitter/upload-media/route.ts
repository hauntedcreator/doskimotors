import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl } = body;
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL.' }, { status: 400 });
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

    console.log('Downloading image from URL:', imageUrl);
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('Failed to download image:', {
        status: imageResponse.status,
        statusText: imageResponse.statusText
      });
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const contentType = imageResponse.headers.get('content-type');
    console.log('Image content type:', contentType);

    if (!contentType?.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    console.log('Image size:', imageBuffer.byteLength, 'bytes');

    if (imageBuffer.byteLength > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image file size exceeds 5MB limit.');
    }

    console.log('Uploading media to Twitter...');
    try {
      // Upload to Twitter
      const mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), {
        mimeType: contentType
      });
      console.log('Media uploaded successfully:', mediaId);

      return NextResponse.json({ 
        success: true, 
        media_id: mediaId 
      });
    } catch (uploadError) {
      console.error('Twitter media upload error:', uploadError);
      throw uploadError;
    }
  } catch (error) {
    console.error('Twitter media upload error:', error);

    let errorMessage = 'Failed to upload media.';
    if (error instanceof Error) {
      if (error.message.includes('Status: 403')) {
        errorMessage = 'Twitter API access forbidden. Please verify that your account has Write permissions enabled.';
      } else if (error.message.includes('Status: 429')) {
        errorMessage = 'Twitter rate limit exceeded for media upload.';
      } else if (error.message.includes('Status: 401')) {
        errorMessage = 'Twitter authentication expired. Please reconnect your account.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      } : undefined
    }, { status: 500 });
  }
} 