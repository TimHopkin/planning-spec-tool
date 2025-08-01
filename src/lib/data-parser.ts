import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import matter from 'gray-matter';
import { 
  ApplicationType, 
  ApplicationSubType, 
  PlanningModule, 
  ApplicationModuleJoin,
  PlanningRequirement,
  Field,
  Component,
  ComponentField,
  ExampleData,
  ProcessedApplication,
  ProcessedModule
} from '@/types/planning';

// Base path to the planning specification data
const SPEC_BASE_PATH = path.resolve(process.cwd(), '../planning-application-data-specification');

export class DataParser {
  private static instance: DataParser;
  private applicationTypes: ApplicationType[] = [];
  private applicationSubTypes: ApplicationSubType[] = [];
  private planningModules: PlanningModule[] = [];
  private applicationModuleJoins: ApplicationModuleJoin[] = [];
  private planningRequirements: PlanningRequirement[] = [];
  private fields: Field[] = [];
  private components: Component[] = [];
  private examples: ExampleData[] = [];
  private initialized = false;

  static getInstance(): DataParser {
    if (!DataParser.instance) {
      DataParser.instance = new DataParser();
    }
    return DataParser.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Promise.all([
        this.loadApplicationTypes(),
        this.loadApplicationSubTypes(),
        this.loadPlanningModules(),
        this.loadApplicationModuleJoins(),
        this.loadPlanningRequirements(),
        this.loadFields(),
        this.loadComponents(),
        this.loadExamples()
      ]);
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize data parser:', error);
      throw error;
    }
  }

  private async loadCSV<T>(filePath: string, transformer: (row: any) => T): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];
      const fullPath = path.join(SPEC_BASE_PATH, filePath);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`CSV file not found: ${fullPath}`);
        resolve([]);
        return;
      }

      fs.createReadStream(fullPath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            const transformed = transformer(row);
            if (transformed) results.push(transformed);
          } catch (error) {
            console.warn(`Error transforming row in ${filePath}:`, error);
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  private async loadApplicationTypes(): Promise<void> {
    this.applicationTypes = await this.loadCSV(
      'data/planning-application-type.csv',
      (row): ApplicationType => ({
        reference: row.reference,
        name: row.name,
        description: row.description,
        synonyms: row.synonyms,
        legislation: row.legislation,
        notes: row.notes,
        entryDate: row['entry-date'],
        startDate: row['start-date'],
        endDate: row['end-date']
      })
    );
  }

  private async loadApplicationSubTypes(): Promise<void> {
    this.applicationSubTypes = await this.loadCSV(
      'data/planning-application-sub-type.csv',
      (row): ApplicationSubType => ({
        reference: row.reference,
        name: row.name,
        description: row.description,
        applicationType: row['application-type'],
        entryDate: row['entry-date'],
        startDate: row['start-date'],
        endDate: row['end-date']
      })
    );
  }

  private async loadPlanningModules(): Promise<void> {
    this.planningModules = await this.loadCSV(
      'data/planning-application-module.csv',
      (row): PlanningModule | null => {
        if (!row.reference) return null;
        return {
          reference: row.reference,
          name: row.name,
          description: row.description,
          discussionNumber: row['discussion-number'],
          applicationForms: row['application-forms'],
          notes: row.notes,
          replacedBy: row['replaced-by'],
          entryDate: row['entry-date'],
          endDate: row['end-date']
        };
      }
    );
  }

  private async loadApplicationModuleJoins(): Promise<void> {
    this.applicationModuleJoins = await this.loadCSV(
      'data/application-type-module.csv',
      (row): ApplicationModuleJoin => ({
        applicationType: row['application-type'],
        applicationSubType: row['application-sub-type'],
        applicationModule: row['application-module'],
        entryDate: row['entry-date'],
        endDate: row['end-date']
      })
    );
  }

  private async loadPlanningRequirements(): Promise<void> {
    this.planningRequirements = await this.loadCSV(
      'data/planning-requirement.csv',
      (row): PlanningRequirement => ({
        reference: row.reference,
        name: row.name,
        description: row.description,
        legislation: row.legislation,
        notes: row.notes,
        entryDate: row['entry-date'],
        endDate: row['end-date']
      })
    );
  }

  private async loadFields(): Promise<void> {
    const fieldDir = path.join(SPEC_BASE_PATH, 'specification/field');
    if (!fs.existsSync(fieldDir)) return;

    const fieldFiles = fs.readdirSync(fieldDir).filter(f => f.endsWith('.md'));
    
    this.fields = await Promise.all(
      fieldFiles.map(async (file): Promise<Field> => {
        const filePath = path.join(fieldDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter } = matter(content);
        
        return {
          reference: path.basename(file, '.md'),
          name: frontmatter.name || path.basename(file, '.md'),
          description: frontmatter.description || '',
          dataType: frontmatter['data-type'] || 'string',
          required: frontmatter.required === true,
          notes: frontmatter.notes,
          validation: frontmatter.validation || [],
          entryDate: frontmatter['entry-date'] || new Date().toISOString().split('T')[0],
          endDate: frontmatter['end-date']
        };
      })
    );
  }

  private async loadComponents(): Promise<void> {
    const componentDir = path.join(SPEC_BASE_PATH, 'specification/component');
    if (!fs.existsSync(componentDir)) return;

    const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.md'));
    
    this.components = await Promise.all(
      componentFiles.map(async (file): Promise<Component> => {
        const filePath = path.join(componentDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter } = matter(content);
        
        const fields: ComponentField[] = (frontmatter.fields || []).map((field: any) => ({
          field: field.field,
          required: field.required === true,
          notes: field.notes
        }));

        return {
          reference: path.basename(file, '.md'),
          name: frontmatter.name || path.basename(file, '.md'),
          description: frontmatter.description || '',
          fields,
          validation: frontmatter.validation || [],
          entryDate: frontmatter['entry-date'] || new Date().toISOString().split('T')[0],
          endDate: frontmatter['end-date']
        };
      })
    );
  }

  private async loadExamples(): Promise<void> {
    const exampleDir = path.join(SPEC_BASE_PATH, 'specification/example');
    if (!fs.existsSync(exampleDir)) return;

    const exampleFiles = fs.readdirSync(exampleDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));
    
    this.examples = await Promise.all(
      exampleFiles.map(async (file): Promise<ExampleData> => {
        const filePath = path.join(exampleDir, file);
        let data: any = {};
        let applicationType = '';
        let name = path.basename(file, path.extname(file));
        let description = '';

        if (file.endsWith('.json')) {
          const content = fs.readFileSync(filePath, 'utf-8').trim();
          if (content) {
            try {
              data = JSON.parse(content);
            } catch (error) {
              console.warn(`Failed to parse JSON in ${file}:`, error);
              data = {};
            }
          } else {
            console.warn(`Empty JSON file: ${file}`);
            data = {};
          }
        } else if (file.endsWith('.md')) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const { data: frontmatter, content: mdContent } = matter(content);
          
          applicationType = frontmatter['application-type'] || '';
          name = frontmatter.name || name;
          description = frontmatter.description || '';

          // Extract JSON from markdown content
          const jsonMatch = mdContent.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1].trim()) {
            try {
              data = JSON.parse(jsonMatch[1].trim());
            } catch (error) {
              console.warn(`Failed to parse JSON in ${file}:`, error);
              data = {};
            }
          }
        }

        return {
          reference: path.basename(file, path.extname(file)),
          name,
          applicationType,
          description,
          data,
          filePath: file
        };
      })
    );
  }

  // Getter methods
  getApplicationTypes(): ApplicationType[] {
    return this.applicationTypes;
  }

  getApplicationSubTypes(): ApplicationSubType[] {
    return this.applicationSubTypes;
  }

  getPlanningModules(): PlanningModule[] {
    return this.planningModules;
  }

  getPlanningRequirements(): PlanningRequirement[] {
    return this.planningRequirements;
  }

  getFields(): Field[] {
    return this.fields;
  }

  getComponents(): Component[] {
    return this.components;
  }

  getExamples(): ExampleData[] {
    return this.examples;
  }

  // Utility methods for processed data
  getProcessedApplication(reference: string): ProcessedApplication | null {
    const appType = this.applicationTypes.find(a => a.reference === reference);
    if (!appType) return null;

    const subTypes = this.applicationSubTypes.filter(s => s.applicationType === reference);
    const modules = this.planningModules.filter(m => 
      this.applicationModuleJoins.some(j => 
        j.applicationType === reference && j.applicationModule === m.reference && !j.endDate
      )
    );
    const examples = this.examples.filter(e => e.applicationType === reference);

    return {
      type: appType,
      subTypes,
      modules,
      requirements: [], // TODO: Link requirements
      examples
    };
  }

  getProcessedModule(reference: string): ProcessedModule | null {
    const module = this.planningModules.find(m => m.reference === reference);
    if (!module) return null;

    const applicationTypes = this.applicationModuleJoins
      .filter(j => j.applicationModule === reference && !j.endDate)
      .map(j => j.applicationType);

    const examples = this.examples.filter(e => 
      applicationTypes.includes(e.applicationType)
    );

    return {
      module,
      fields: [], // TODO: Link module fields
      components: [], // TODO: Link module components
      applicationTypes,
      examples
    };
  }

  search(query: string): any[] {
    const results: any[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Search application types
    this.applicationTypes.forEach(app => {
      if (app.name.toLowerCase().includes(lowercaseQuery) || 
          app.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          type: 'application',
          reference: app.reference,
          name: app.name,
          description: app.description,
          score: this.calculateScore(app.name + ' ' + app.description, query),
          path: `/applications/${app.reference}`
        });
      }
    });

    // Search modules
    this.planningModules.forEach(module => {
      if (module.name.toLowerCase().includes(lowercaseQuery) || 
          module.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          type: 'module',
          reference: module.reference,
          name: module.name,
          description: module.description,
          score: this.calculateScore(module.name + ' ' + module.description, query),
          path: `/modules/${module.reference}`
        });
      }
    });

    // Search fields
    this.fields.forEach(field => {
      if (field.name.toLowerCase().includes(lowercaseQuery) || 
          field.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          type: 'field',
          reference: field.reference,
          name: field.name,
          description: field.description,
          score: this.calculateScore(field.name + ' ' + field.description, query),
          path: `/fields/${field.reference}`
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  private calculateScore(text: string, query: string): number {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    if (lowerText === lowerQuery) return 100;
    if (lowerText.startsWith(lowerQuery)) return 90;
    if (lowerText.includes(lowerQuery)) return 70 + (query.length / text.length) * 20;
    
    // Simple word matching score
    const queryWords = lowerQuery.split(/\s+/);
    const textWords = lowerText.split(/\s+/);
    const matches = queryWords.filter(qw => textWords.some(tw => tw.includes(qw)));
    
    return (matches.length / queryWords.length) * 50;
  }
}

export default DataParser;