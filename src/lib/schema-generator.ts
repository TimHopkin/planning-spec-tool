import { ApplicationType, Field, Component, PlanningModule } from '@/types/planning';

export interface JsonSchema {
  $schema: string;
  type: string;
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: string[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  additionalProperties?: boolean;
}

export class SchemaGenerator {
  private fields: Field[] = [];
  private components: Component[] = [];
  private modules: PlanningModule[] = [];

  constructor(fields: Field[], components: Component[], modules: PlanningModule[]) {
    this.fields = fields;
    this.components = components;
    this.modules = modules;
  }

  generateApplicationSchema(applicationType: ApplicationType, requiredModules: string[]): JsonSchema {
    const schema: JsonSchema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      title: `${applicationType.name} Application`,
      description: applicationType.description,
      additionalProperties: false,
      properties: {
        reference: {
          type: 'string',
          format: 'uuid',
          description: 'UUID for the application record'
        },
        'application-types': {
          type: 'array',
          items: {
            type: 'string',
            enum: [applicationType.reference]
          },
          minLength: 1,
          description: 'A list of planning application types'
        },
        'planning-authority': {
          type: 'string',
          description: 'The reference of the planning authority the application has been submitted to'
        },
        'submission-date': {
          type: 'string',
          format: 'date',
          description: 'Date the application is submitted. In YYYY-MM-DD format'
        },
        modules: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'List of required sections/modules for this application'
        },
        documents: {
          type: 'array',
          items: this.generateDocumentSchema(),
          description: 'List of submitted documents'
        }
      },
      required: ['reference', 'application-types', 'planning-authority', 'submission-date', 'modules', 'documents']
    };

    // Add module-specific properties
    requiredModules.forEach(moduleRef => {
      const module = this.modules.find(m => m.reference === moduleRef);
      if (module) {
        const moduleSchema = this.generateModuleSchema(module);
        if (moduleSchema && schema.properties) {
          schema.properties[moduleRef] = moduleSchema;
          if (schema.required) {
            schema.required.push(moduleRef);
          }
        }
      }
    });

    return schema;
  }

  generateModuleSchema(module: PlanningModule): JsonSchema | null {
    // For now, generate a basic module schema
    // In a real implementation, you'd parse the module specification files
    return {
      type: 'object',
      title: module.name,
      description: module.description,
      additionalProperties: false,
      properties: {},
      required: []
    };
  }

  generateFieldSchema(field: Field): JsonSchema {
    const schema: JsonSchema = {
      description: field.description
    };

    // Map data types to JSON Schema types
    switch (field.dataType.toLowerCase()) {
      case 'string':
        schema.type = 'string';
        break;
      case 'number':
      case 'integer':
        schema.type = field.dataType.toLowerCase() === 'integer' ? 'integer' : 'number';
        break;
      case 'boolean':
        schema.type = 'boolean';
        break;
      case 'date':
        schema.type = 'string';
        schema.format = 'date';
        break;
      case 'datetime':
        schema.type = 'string';
        schema.format = 'date-time';
        break;
      case 'uuid':
        schema.type = 'string';
        schema.format = 'uuid';
        break;
      case 'email':
        schema.type = 'string';
        schema.format = 'email';
        break;
      case 'url':
        schema.type = 'string';
        schema.format = 'uri';
        break;
      case 'enum':
        schema.type = 'string';
        // Add enum values if available
        break;
      case 'array':
        schema.type = 'array';
        schema.items = { type: 'string' };
        break;
      case 'object':
        schema.type = 'object';
        schema.additionalProperties = true;
        break;
      default:
        schema.type = 'string';
    }

    // Apply validation rules
    if (field.validation) {
      field.validation.forEach(rule => {
        this.applyValidationRule(schema, rule);
      });
    }

    return schema;
  }

  generateComponentSchema(component: Component): JsonSchema {
    const schema: JsonSchema = {
      type: 'object',
      title: component.name,
      description: component.description,
      additionalProperties: false,
      properties: {},
      required: []
    };

    // Add component fields
    component.fields.forEach(fieldRef => {
      const field = this.fields.find(f => f.reference === fieldRef.field);
      if (field && schema.properties) {
        schema.properties[field.reference] = this.generateFieldSchema(field);
        if (fieldRef.required && schema.required) {
          schema.required.push(field.reference);
        }
      }
    });

    // Apply component validation rules
    if (component.validation) {
      component.validation.forEach(rule => {
        this.applyValidationRule(schema, rule);
      });
    }

    return schema;
  }

  private generateDocumentSchema(): JsonSchema {
    return {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description: 'A reference for the document'
        },
        name: {
          type: 'string',
          description: 'The name or title of the document'
        },
        description: {
          type: 'string',
          description: 'Brief description of what the document contains'
        },
        'document-types': {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'List of codelist references that the document covers'
        },
        file: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              format: 'uri',
              description: 'A URL pointing to the stored file'
            },
            base64: {
              type: 'string',
              description: 'Base64-encoded content of the file'
            },
            filename: {
              type: 'string',
              description: 'Name of the file being uploaded'
            },
            'mime-type': {
              type: 'string',
              description: 'MIME type of the file'
            },
            'file-size': {
              type: 'integer',
              description: 'Size of the file in bytes'
            }
          },
          required: ['filename'],
          additionalProperties: false,
          description: 'The digital file or a reference to where the file is stored'
        }
      },
      required: ['reference', 'name', 'document-types', 'file'],
      additionalProperties: false
    };
  }

  private applyValidationRule(schema: JsonSchema, rule: string): void {
    // Parse common validation rules
    if (rule.includes('must be') && rule.includes('characters')) {
      const match = rule.match(/(\d+)/);
      if (match) {
        const length = parseInt(match[1]);
        if (rule.includes('minimum') || rule.includes('min')) {
          schema.minLength = length;
        } else if (rule.includes('maximum') || rule.includes('max')) {
          schema.maxLength = length;
        }
      }
    }

    if (rule.includes('pattern') || rule.includes('format')) {
      // Extract regex patterns if available
      const regexMatch = rule.match(/\/(.+)\//);
      if (regexMatch) {
        schema.pattern = regexMatch[1];
      }
    }

    if (rule.includes('unique')) {
      // Add uniqueItems for arrays
      if (schema.type === 'array') {
        schema['uniqueItems'] = true;
      }
    }

    if (rule.includes('enum') || rule.includes('one of')) {
      // This would need to be parsed from the actual rule
      // For now, just mark it as having constraints
    }
  }

  generateExampleFromSchema(schema: JsonSchema): any {
    switch (schema.type) {
      case 'object':
        const obj: any = {};
        if (schema.properties) {
          Object.keys(schema.properties).forEach(key => {
            const propSchema = schema.properties![key];
            if (schema.required?.includes(key) || Math.random() > 0.5) {
              obj[key] = this.generateExampleFromSchema(propSchema);
            }
          });
        }
        return obj;

      case 'array':
        const arrayLength = Math.floor(Math.random() * 3) + 1;
        const array = [];
        for (let i = 0; i < arrayLength; i++) {
          if (schema.items) {
            array.push(this.generateExampleFromSchema(schema.items));
          }
        }
        return array;

      case 'string':
        if (schema.format === 'uuid') {
          return '550e8400-e29b-41d4-a716-446655440000';
        }
        if (schema.format === 'date') {
          return '2024-01-15';
        }
        if (schema.format === 'date-time') {
          return '2024-01-15T10:30:00Z';
        }
        if (schema.format === 'email') {
          return 'example@example.com';
        }
        if (schema.format === 'uri') {
          return 'https://example.com';
        }
        if (schema.enum && schema.enum.length > 0) {
          return schema.enum[Math.floor(Math.random() * schema.enum.length)];
        }
        return 'Example string value';

      case 'number':
      case 'integer':
        const min = schema.minimum || 0;
        const max = schema.maximum || 100;
        const value = Math.random() * (max - min) + min;
        return schema.type === 'integer' ? Math.floor(value) : Math.round(value * 100) / 100;

      case 'boolean':
        return Math.random() > 0.5;

      default:
        return null;
    }
  }

  validateData(data: any, schema: JsonSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic type validation
    if (schema.type && typeof data !== schema.type) {
      if (!(schema.type === 'integer' && typeof data === 'number' && Number.isInteger(data))) {
        errors.push(`Expected type ${schema.type}, got ${typeof data}`);
      }
    }

    // Required properties validation for objects
    if (schema.type === 'object' && schema.required) {
      schema.required.forEach(prop => {
        if (!(prop in data)) {
          errors.push(`Missing required property: ${prop}`);
        }
      });
    }

    // String validations
    if (typeof data === 'string') {
      if (schema.minLength && data.length < schema.minLength) {
        errors.push(`String length ${data.length} is less than minimum ${schema.minLength}`);
      }
      if (schema.maxLength && data.length > schema.maxLength) {
        errors.push(`String length ${data.length} exceeds maximum ${schema.maxLength}`);
      }
      if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
        errors.push(`String does not match pattern: ${schema.pattern}`);
      }
      if (schema.enum && !schema.enum.includes(data)) {
        errors.push(`Value "${data}" is not in allowed enum values: ${schema.enum.join(', ')}`);
      }
    }

    // Number validations
    if (typeof data === 'number') {
      if (schema.minimum && data < schema.minimum) {
        errors.push(`Value ${data} is less than minimum ${schema.minimum}`);
      }
      if (schema.maximum && data > schema.maximum) {
        errors.push(`Value ${data} exceeds maximum ${schema.maximum}`);
      }
    }

    // Array validations
    if (Array.isArray(data)) {
      if (schema.items) {
        data.forEach((item, index) => {
          const itemValidation = this.validateData(item, schema.items!);
          if (!itemValidation.valid) {
            itemValidation.errors.forEach(error => {
              errors.push(`Item ${index}: ${error}`);
            });
          }
        });
      }
    }

    // Object property validations
    if (schema.type === 'object' && schema.properties) {
      Object.keys(data).forEach(prop => {
        if (schema.properties![prop]) {
          const propValidation = this.validateData(data[prop], schema.properties![prop]);
          if (!propValidation.valid) {
            propValidation.errors.forEach(error => {
              errors.push(`Property ${prop}: ${error}`);
            });
          }
        } else if (schema.additionalProperties === false) {
          errors.push(`Additional property not allowed: ${prop}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default SchemaGenerator;