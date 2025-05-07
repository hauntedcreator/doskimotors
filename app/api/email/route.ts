import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      email, 
      subject, 
      message, 
      phone, 
      source = 'contact-form',
      vehicleId = '',
      vehicleTitle = '',
      files = [] 
    } = await req.json();

    // Check required fields
    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });

    // Generate a source label for the email subject
    const sourceLabel = 
      source === 'contact-page' ? 'Contact Form' : 
      source === 'services-page' ? 'Services Page' : 
      source === 'vehicle-contact' ? 'Vehicle Inquiry' : 
      source === 'tesla-repairs-page' ? 'Tesla Repairs' :
      'Website';

    // Create email subject
    const emailSubject = vehicleTitle 
      ? `${sourceLabel}: Interest in ${vehicleTitle}`
      : `${sourceLabel}: ${subject || 'New Inquiry'}`;

    // Create attachment section HTML if files are provided
    const attachmentSection = files && files.length > 0 
      ? `
        <h3 style="color: #555; margin-top: 20px;">Attachments:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
          ${files.map((file, index) => `
            <div style="margin-bottom: 10px;">
              <a href="${file}" target="_blank">
                <img src="${file}" alt="Attachment ${index+1}" style="max-width: 200px; max-height: 150px; border-radius: 4px; border: 1px solid #ddd;">
              </a>
              <div style="font-size: 12px; margin-top: 4px;">
                <a href="${file}" target="_blank" style="color: #3B82F6; text-decoration: underline;">View full image</a>
              </div>
            </div>
          `).join('')}
        </div>
      `
      : '';

    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Message from ${name || 'Website Visitor'}</h2>
        <p><strong>Source:</strong> ${sourceLabel}</p>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
        ${vehicleId ? `<p><strong>Vehicle ID:</strong> ${vehicleId}</p>` : ''}
        ${vehicleTitle ? `<p><strong>Vehicle:</strong> ${vehicleTitle}</p>` : ''}
        <h3 style="color: #555; margin-top: 20px;">Message:</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px;">
          ${(message || '').replace(/\n/g, '<br>')}
        </div>
        ${attachmentSection}
        <p style="margin-top: 20px; font-size: 12px; color: #777;">
          <em>This email was sent from ${sourceLabel} on the Doski Motors website. 
          You can reply directly to this email to respond to the sender.</em>
        </p>
      </div>
    `;

    const mailOptions = {
      from: {
        name: `Doski Motors ${sourceLabel}`,
        address: process.env.EMAIL_USER || '',
      },
      to: 'doskimotors@gmail.com', // Main dealership email
      cc: process.env.EMAIL_CC || '',  // Optional CC for staff notifications
      replyTo: email, // Set reply-to to the sender's email
      subject: emailSubject,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to send email.' }, 
      { status: 500 }
    );
  }
} 