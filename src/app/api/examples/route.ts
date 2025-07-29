import { NextResponse } from 'next/server';
import DataParser from '@/lib/data-parser';
import { ApiResponse, ExampleData } from '@/types/planning';

export async function GET(request: Request) {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const { searchParams } = new URL(request.url);
    const applicationType = searchParams.get('applicationType');
    
    let examples = parser.getExamples();
    
    if (applicationType) {
      examples = examples.filter(e => e.applicationType === applicationType);
    }
    
    const response: ApiResponse<ExampleData[]> = {
      data: examples,
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