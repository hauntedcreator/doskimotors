import { NextResponse } from 'next/server';

/**
 * Temporarily disabled proxy API
 */
export async function GET(request: Request) {
  return NextResponse.json({
    status: 'disabled',
    message: 'The auction proxy API is temporarily disabled as we work on improving our data sources.',
    timeDisabled: new Date().toISOString(),
    expectedReturnDate: 'TBD'
  });
} 