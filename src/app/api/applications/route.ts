import { NextResponse } from 'next/server';
import DataParser from '@/lib/data-parser';
import { ApiResponse, ApplicationType } from '@/types/planning';

export async function GET() {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const applications = parser.getApplicationTypes();
    
    const response: ApiResponse<ApplicationType[]> = {
      data: applications,
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