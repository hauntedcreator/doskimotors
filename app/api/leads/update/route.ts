import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const leadsFile = path.join(process.cwd(), 'data', 'leads.json');

export async function POST(request: Request) {
  try {
    const { index, read, viewedAt } = await request.json();
    
    if (typeof index !== 'number') {
      return NextResponse.json(
        { error: 'Invalid index provided' },
        { status: 400 }
      );
    }

    // Read existing leads file
    let leads = [];
    try {
      const fileData = await fs.readFile(leadsFile, 'utf-8');
      leads = JSON.parse(fileData);
    } catch (error) {
      console.error('Error reading leads file:', error);
      return NextResponse.json(
        { error: 'Failed to read leads data' },
        { status: 500 }
      );
    }

    // Check if index is valid
    if (index < 0 || index >= leads.length) {
      return NextResponse.json(
        { error: 'Index out of bounds' },
        { status: 400 }
      );
    }

    // Update the lead
    leads[index] = {
      ...leads[index],
      read: read,
      viewedAt: viewedAt
    };

    // Write back to file
    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));

    return NextResponse.json(
      { success: true, message: 'Lead updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
} 