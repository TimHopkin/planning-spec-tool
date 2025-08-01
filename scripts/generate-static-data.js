const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const matter = require('gray-matter');

// Base path to the planning specification data
const SPEC_BASE_PATH = path.resolve(process.cwd(), '../planning-application-data-specification');
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/data');

async function loadCSV(filePath, transformer) {
  return new Promise((resolve, reject) => {
    const results = [];
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

async function loadApplicationTypes() {
  return await loadCSV(
    'data/planning-application-type.csv',
    (row) => ({
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

async function loadApplicationSubTypes() {
  return await loadCSV(
    'data/planning-application-sub-type.csv',
    (row) => ({
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

async function loadPlanningModules() {
  return await loadCSV(
    'data/planning-application-module.csv',
    (row) => {
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

async function loadApplicationModuleJoins() {
  return await loadCSV(
    'data/application-type-module.csv',
    (row) => ({
      applicationType: row['application-type'],
      applicationSubType: row['application-sub-type'],
      applicationModule: row['application-module'],
      entryDate: row['entry-date'],
      endDate: row['end-date']
    })
  );
}

async function loadPlanningRequirements() {
  return await loadCSV(
    'data/planning-requirement.csv',
    (row) => ({
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

async function loadFields() {
  const fieldDir = path.join(SPEC_BASE_PATH, 'specification/field');
  if (!fs.existsSync(fieldDir)) return [];

  const fieldFiles = fs.readdirSync(fieldDir).filter(f => f.endsWith('.md'));
  
  return await Promise.all(
    fieldFiles.map(async (file) => {
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

async function loadComponents() {
  const componentDir = path.join(SPEC_BASE_PATH, 'specification/component');
  if (!fs.existsSync(componentDir)) return [];

  const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.md'));
  
  return await Promise.all(
    componentFiles.map(async (file) => {
      const filePath = path.join(componentDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter } = matter(content);
      
      const fields = (frontmatter.fields || []).map((field) => ({
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

async function loadExamples() {
  const exampleDir = path.join(SPEC_BASE_PATH, 'specification/example');
  if (!fs.existsSync(exampleDir)) return [];

  const exampleFiles = fs.readdirSync(exampleDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));
  
  return await Promise.all(
    exampleFiles.map(async (file) => {
      const filePath = path.join(exampleDir, file);
      let data = {};
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

async function generateStaticData() {
  console.log('Starting static data generation...');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Load all data
    console.log('Loading application types...');
    const applicationTypes = await loadApplicationTypes();
    
    console.log('Loading application sub-types...');
    const applicationSubTypes = await loadApplicationSubTypes();
    
    console.log('Loading planning modules...');
    const planningModules = await loadPlanningModules();
    
    console.log('Loading application-module joins...');
    const applicationModuleJoins = await loadApplicationModuleJoins();
    
    console.log('Loading planning requirements...');
    const planningRequirements = await loadPlanningRequirements();
    
    console.log('Loading fields...');
    const fields = await loadFields();
    
    console.log('Loading components...');
    const components = await loadComponents();
    
    console.log('Loading examples...');
    const examples = await loadExamples();

    // Generate processed applications with modules
    const processedApplications = applicationTypes.map(appType => {
      const subTypes = applicationSubTypes.filter(s => s.applicationType === appType.reference);
      const modules = planningModules.filter(m => 
        applicationModuleJoins.some(j => 
          j.applicationType === appType.reference && j.applicationModule === m.reference && !j.endDate
        )
      );
      const appExamples = examples.filter(e => e.applicationType === appType.reference);

      return {
        type: appType,
        subTypes,
        modules,
        requirements: [], // TODO: Link requirements if needed
        examples: appExamples
      };
    });

    // Generate processed modules
    const processedModules = planningModules.map(module => {
      const appTypes = applicationModuleJoins
        .filter(j => j.applicationModule === module.reference && !j.endDate)
        .map(j => j.applicationType);

      const moduleExamples = examples.filter(e => 
        appTypes.includes(e.applicationType)
      );

      return {
        module,
        fields: [], // TODO: Link module fields if needed
        components: [], // TODO: Link module components if needed
        applicationTypes: appTypes,
        examples: moduleExamples
      };
    });

    // Write JSON files
    console.log('Writing applications.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'applications.json'),
      JSON.stringify({ success: true, data: applicationTypes }, null, 2)
    );

    console.log('Writing processed-applications.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'processed-applications.json'),
      JSON.stringify({ success: true, data: processedApplications }, null, 2)
    );

    console.log('Writing modules.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'modules.json'),
      JSON.stringify({ success: true, data: planningModules }, null, 2)
    );

    console.log('Writing processed-modules.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'processed-modules.json'),
      JSON.stringify({ success: true, data: processedModules }, null, 2)
    );

    console.log('Writing fields.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'fields.json'),
      JSON.stringify({ success: true, data: fields }, null, 2)
    );

    console.log('Writing components.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'components.json'),
      JSON.stringify({ success: true, data: components }, null, 2)
    );

    console.log('Writing examples.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'examples.json'),
      JSON.stringify({ success: true, data: examples }, null, 2)
    );

    console.log('Writing application-sub-types.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'application-sub-types.json'),
      JSON.stringify({ success: true, data: applicationSubTypes }, null, 2)
    );

    console.log('Writing planning-requirements.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'planning-requirements.json'),
      JSON.stringify({ success: true, data: planningRequirements }, null, 2)
    );

    // Create search index
    const searchIndex = [];
    
    // Add applications to search
    applicationTypes.forEach(app => {
      searchIndex.push({
        type: 'application',
        reference: app.reference,
        name: app.name,
        description: app.description,
        path: `/applications/${app.reference}`
      });
    });

    // Add modules to search
    planningModules.forEach(module => {
      searchIndex.push({
        type: 'module',
        reference: module.reference,
        name: module.name,
        description: module.description,
        path: `/modules/${module.reference}`
      });
    });

    // Add fields to search
    fields.forEach(field => {
      searchIndex.push({
        type: 'field',
        reference: field.reference,
        name: field.name,
        description: field.description,
        path: `/fields/${field.reference}`
      });
    });

    console.log('Writing search-index.json...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'search-index.json'),
      JSON.stringify({ success: true, data: searchIndex }, null, 2)
    );

    console.log(`✅ Static data generation complete! Generated ${Object.keys({
      'applications.json': applicationTypes.length,
      'modules.json': planningModules.length,
      'fields.json': fields.length,
      'components.json': components.length,
      'examples.json': examples.length,
      'search-index.json': searchIndex.length
    }).length} JSON files.`);

    console.log(`📊 Data summary:`);
    console.log(`  - ${applicationTypes.length} application types`);
    console.log(`  - ${planningModules.length} planning modules`);
    console.log(`  - ${fields.length} fields`);
    console.log(`  - ${components.length} components`);
    console.log(`  - ${examples.length} examples`);
    console.log(`  - ${searchIndex.length} search index entries`);

  } catch (error) {
    console.error('❌ Error generating static data:', error);
    process.exit(1);
  }
}

// Run the generator
generateStaticData();