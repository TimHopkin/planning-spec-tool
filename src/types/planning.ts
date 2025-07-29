// Core planning application data types
export interface ApplicationType {
  reference: string;
  name: string;
  description: string;
  synonyms?: string;
  legislation: string;
  notes?: string;
  entryDate: string;
  startDate?: string;
  endDate?: string;
}

export interface ApplicationSubType {
  reference: string;
  name: string;
  description: string;
  applicationType: string;
  entryDate: string;
  startDate?: string;
  endDate?: string;
}

export interface PlanningModule {
  reference: string;
  name: string;
  description: string;
  discussionNumber?: string;
  applicationForms?: string;
  notes?: string;
  replacedBy?: string;
  entryDate: string;
  endDate?: string;
}

export interface ApplicationModuleJoin {
  applicationType: string;
  applicationSubType?: string;
  applicationModule: string;
  entryDate: string;
  endDate?: string;
}

export interface PlanningRequirement {
  reference: string;
  name: string;
  description: string;
  legislation?: string;
  notes?: string;
  entryDate: string;
  endDate?: string;
}

export interface Field {
  reference: string;
  name: string;
  description: string;
  dataType: string;
  required: boolean;
  notes?: string;
  validation?: string[];
  entryDate: string;
  endDate?: string;
}

export interface Component {
  reference: string;
  name: string;
  description: string;
  fields: ComponentField[];
  validation?: string[];
  entryDate: string;
  endDate?: string;
}

export interface ComponentField {
  field: string;
  required: boolean;
  notes?: string;
}

export interface Codelist {
  reference: string;
  name: string;
  description: string;
  values: CodelistValue[];
  entryDate: string;
  endDate?: string;
}

export interface CodelistValue {
  value: string;
  name: string;
  description?: string;
  entryDate: string;
  endDate?: string;
}

export interface ExampleData {
  reference: string;
  name: string;
  applicationType: string;
  description: string;
  data: any;
  filePath: string;
}

export interface SpecificationModule {
  reference: string;
  name: string;
  description: string;
  fields: string[];
  applicationTypes: string[];
  required: boolean;
}

// Processed data structures for the UI
export interface ProcessedApplication {
  type: ApplicationType;
  subTypes: ApplicationSubType[];
  modules: PlanningModule[];
  requirements: PlanningRequirement[];
  examples: ExampleData[];
}

export interface ProcessedModule {
  module: PlanningModule;
  fields: Field[];
  components: Component[];
  applicationTypes: string[];
  examples: ExampleData[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface SearchResult {
  type: 'application' | 'module' | 'field' | 'component' | 'example';
  reference: string;
  name: string;
  description: string;
  score: number;
  path: string;
}