import { NextRequest, NextResponse } from 'next/server';
import { DataParser } from '@/lib/data-parser';
import { ApiResponse, PlanningModule } from '@/types/planning';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PlanningModule[]>>> {
  try {
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const modules = parser.getPlanningModules();
    
    return NextResponse.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to fetch modules'
      },
      { status: 500 }
    );
  }
}