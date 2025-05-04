import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const leadsFile = path.join(process.cwd(), 'data', 'leads.json');

export async function GET(req: NextRequest) {
  // Set headers for SSE connection
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Function to send lead updates
      const sendUpdate = async () => {
        try {
          // Read the leads file
          const data = await fs.readFile(leadsFile, 'utf-8');
          const leads = JSON.parse(data);
          
          // Create an SSE formatted message
          const message = `data: ${JSON.stringify({ type: 'update', leads })}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          console.error('Error in SSE stream:', error);
          const errorMsg = `data: ${JSON.stringify({ type: 'error', message: 'Failed to fetch leads' })}\n\n`;
          controller.enqueue(encoder.encode(errorMsg));
        }
      };

      // Send initial update
      await sendUpdate();

      // Set up an interval to check for updates
      const intervalId = setInterval(sendUpdate, 5000); // Poll every 5 seconds

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
      });
    }
  });

  return new NextResponse(stream, { headers });
} 