import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

const leadsFile = path.join(process.cwd(), 'data', 'leads.json');

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields - be more flexible
    if (!data.email && !data.phone) {
      return NextResponse.json(
        { error: 'Missing contact information (email or phone)' },
        { status: 400 }
      );
    }

    // Create new lead in database (if prisma is available)
    try {
      await prisma.lead.create({
        data: {
          name: data.name || 'Anonymous',
          email: data.email || '',
          phone: data.phone || '',
          message: data.message || data.desc || '',
          subject: data.subject || 'Website Inquiry',
          source: data.source || 'website',
          vehicleId: data.vehicleId || null, 
          vehicleInfo: data.vehicleTitle || null,
          status: 'NEW',
          createdAt: new Date(),
        },
      });
    } catch (prismaError) {
      console.warn('Warning: Unable to save to database, continuing with leads.json:', prismaError);
      // Continue with JSON file storage even if database fails
    }

    // Append to leads.json file (this is the primary storage used by the dashboard)
    try {
      // Read existing leads file or create new array
      let leads = [];
      try {
        const fileData = await fs.readFile(leadsFile, 'utf-8');
        leads = JSON.parse(fileData);
      } catch (error) {
        // If file doesn't exist or is invalid, use empty array
        leads = [];
      }

      // Create the new lead entry
      const newLead = {
        name: data.name || 'No Name',
        email: data.email || '',
        phone: data.phone || '',
        message: data.message || data.desc || '',
        subject: data.subject || 'Website Inquiry',
        source: data.source || 'website',
        date: new Date().toISOString(),
        read: false,
        viewedAt: null,
      };
      
      // Add vehicle information if available
      if (data.vehicleId) newLead.vehicleId = data.vehicleId;
      if (data.vehicleTitle) newLead.vehicleTitle = data.vehicleTitle;
      
      // Add files if they exist
      if (data.files) newLead.files = data.files;

      // Add the new lead to the beginning of the array for newest-first display
      leads.unshift(newLead);

      await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
    } catch (fileError) {
      console.error('Error updating leads.json:', fileError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Lead created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
} 