import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const leadsFile = path.join(process.cwd(), 'data', 'leads.json');

export async function GET() {
  try {
    const data = await fs.readFile(leadsFile, 'utf-8');
    const leads = JSON.parse(data);
    
    // Sort leads by date in descending order (newest first)
    leads.sort((a: any, b: any) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA; // Newest first
    });
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error reading leads file:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json();
    const data = await fs.readFile(leadsFile, 'utf-8');
    const leads = JSON.parse(data);
    lead.date = new Date().toISOString();
    lead.read = false;
    lead.viewedAt = null;
    leads.push(lead);
    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PATCH: mark as read/unread and update viewedAt
export async function PATCH(req: NextRequest) {
  try {
    const { index, read } = await req.json();
    const data = await fs.readFile(leadsFile, 'utf-8');
    const leads = JSON.parse(data);
    if (leads[index]) {
      leads[index].read = read;
      leads[index].viewedAt = read ? new Date().toISOString() : null;
      await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE: remove a lead by index
export async function DELETE(req: NextRequest) {
  try {
    const { index } = await req.json();
    const data = await fs.readFile(leadsFile, 'utf-8');
    const leads = JSON.parse(data);
    if (leads[index]) {
      leads.splice(index, 1);
      await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 