import { NextRequest, NextResponse } from 'next/server';
import { DataParser } from '@/lib/data-parser';
import { ApiResponse, ProcessedApplication } from '@/types/planning';

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
): Promise<NextResponse<ApiResponse<ProcessedApplication | null>>> {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const application = parser.getProcessedApplication(params.reference);
    
    if (!application) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Application not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'Failed to fetch application'
      },
      { status: 500 }
    );
  }
}