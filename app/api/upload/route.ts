import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    console.log('Upload API called');
    const formData = await request.formData()
    const files = formData.getAll('images')
    
    console.log(`Received ${files.length} files in upload request`);

    if (!files || files.length === 0) {
      console.warn('No files received in upload request');
      return NextResponse.json(
        { error: 'No files received.' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (!(file instanceof File)) {
        console.warn('Skipping non-file entry:', file)
        continue
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.warn('Skipping non-image file:', file.name, file.type)
        continue // Skip non-image files instead of returning an error
      }

      try {
        const buffer = await file.arrayBuffer()
        console.log(`Uploading file: ${file.name}, size: ${buffer.byteLength} bytes, type: ${file.type}`)
        
        // Check if Cloudinary config is valid
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
          console.error('Cloudinary configuration missing');
          throw new Error('Cloudinary configuration is missing. Please check environment variables.');
        }
        
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'image',
              folder: 'vehicle-images' 
            }, 
            (err, result) => {
              if (err) {
                console.error('Cloudinary upload error:', err)
                reject(err)
              } else {
                console.log('Cloudinary upload success:', result?.secure_url)
                resolve(result)
              }
            }
          )
          
          // Convert ArrayBuffer to Buffer and pipe to upload stream
          uploadStream.end(Buffer.from(buffer))
        })
        
        const imageUrl = (uploadResult as any).secure_url
        uploadedUrls.push(imageUrl)
        console.log(`Successfully uploaded: ${imageUrl}`)
      } catch (uploadError) {
        console.error(`Error uploading ${file.name}:`, uploadError)
        // Continue with other files even if one fails
      }
    }

    console.log(`Upload complete. ${uploadedUrls.length} files uploaded successfully:`, uploadedUrls)
    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Error handling file upload:', error)
    return NextResponse.json(
      { error: 'Error uploading file.' },
      { status: 500 }
    )
  }
} 