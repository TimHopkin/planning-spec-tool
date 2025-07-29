import { NextResponse } from 'next/server';
import DataParser from '@/lib/data-parser';
import SchemaGenerator from '@/lib/schema-generator';
import { ApiResponse } from '@/types/planning';

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

    const fields = parser.getFields();
    const components = parser.getComponents();
    const modules = parser.getPlanningModules();
    
    const generator = new SchemaGenerator(fields, components, modules);
    const requiredModuleRefs = application.modules.map(m => m.reference);
    const schema = generator.generateApplicationSchema(application.type, requiredModuleRefs);
    
    const response: ApiResponse<any> = {
      data: schema,
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