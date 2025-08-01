import { NextRequest, NextResponse } from 'next/server';
import { DataParser } from '@/lib/data-parser';
import { ApiResponse, ApplicationType } from '@/types/planning';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ApplicationType[]>>> {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const applications = parser.getApplicationTypes();
    
    return NextResponse.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to fetch applications'
      },
      { status: 500 }
    );
  }
}