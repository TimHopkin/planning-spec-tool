import { NextResponse } from 'next/server';
import DataParser from '@/lib/data-parser';
import SchemaGenerator from '@/lib/schema-generator';
import { ApiResponse } from '@/types/planning';

export async function POST(request: Request) {
  try {
    const { data, applicationReference } = await request.json();
    
    if (!data || !applicationReference) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: 'Missing data or applicationReference in request body'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const parser = DataParser.getInstance();
    await parser.initialize();
    
    const application = parser.getProcessedApplication(applicationReference);
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
    
    const validation = generator.validateData(data, schema);
    
    const response: ApiResponse<any> = {
      data: {
        valid: validation.valid,
        errors: validation.errors,
        schema: schema
      },
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