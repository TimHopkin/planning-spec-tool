import { NextResponse } from 'next/server';
import DataParser from '@/lib/data-parser';
import { ApiResponse, SearchResult } from '@/types/planning';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      const response: ApiResponse<SearchResult[]> = {
        data: [],
        success: true
      };
      return NextResponse.json(response);
    }
    
    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const results = parser.search(query);
    
    const response: ApiResponse<SearchResult[]> = {
      data: results,
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