import { NextRequest, NextResponse } from 'next/server';
import { DataParser } from '@/lib/data-parser';
import { ApiResponse, SearchResult } from '@/types/planning';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResult[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }
    
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const results = parser.search(query.trim());
    
    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Failed to perform search'
      },
      { status: 500 }
    );
  }
}