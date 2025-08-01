import { NextRequest, NextResponse } from 'next/server';
import { DataParser } from '@/lib/data-parser';
import { ApiResponse, Field } from '@/types/planning';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Field[]>>> {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const fields = parser.getFields();
    
    return NextResponse.json({
      success: true,
      data: fields
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to fetch fields'
      },
      { status: 500 }
    );
  }
}