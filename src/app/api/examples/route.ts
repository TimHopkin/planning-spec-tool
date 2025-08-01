import { NextRequest, NextResponse } from 'next/server';
import { DataParser } from '@/lib/data-parser';
import { ApiResponse, ExampleData } from '@/types/planning';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ExampleData[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const applicationType = searchParams.get('applicationType');
    
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    let examples = parser.getExamples();
    
    // Filter by application type if specified
    if (applicationType) {
      examples = examples.filter(example => example.applicationType === applicationType);
    }
    
    return NextResponse.json({
      success: true,
      data: examples
    });
  } catch (error) {
    console.error('Error fetching examples:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to fetch examples'
      },
      { status: 500 }
    );
  }
}