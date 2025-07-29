import { NextResponse } from 'next/server';
import DataParser from '@/lib/data-parser';
import { ApiResponse, ProcessedApplication } from '@/types/planning';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const { reference } = await params;
    const application = parser.getProcessedApplication(reference);
    
    if (!application) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: 'Application type not found'
      };
      
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<ProcessedApplication> = {
      data: application,
      success: true
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}