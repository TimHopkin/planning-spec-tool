# Planning Application Data Specification Tool

A comprehensive web-based tool for exploring and working with the UK Planning Application Data Specification. This tool provides an interactive interface for browsing application types, modules, fields, examples, and generating JSON schemas.

## Features

### 🏠 Interactive Application Explorer
- Browse 18+ planning application types with detailed specifications
- View required modules and sub-types for each application
- Drill down into specific application requirements
- Filter and search applications

### 🔧 Planning Modules Browser
- Explore 50+ reusable planning modules
- View module dependencies and relationships
- Filter by active/deprecated status
- Search across all module definitions

### 🏷️ Comprehensive Field Reference
- Browse 200+ field definitions with data types
- View validation rules and requirements
- Filter by data type and required status
- Search field descriptions and references

### 📝 JSON Examples Gallery
- Browse 100+ real-world JSON examples
- Filter examples by application type
- Copy and download example data
- Use as templates for your implementations

### 🛠️ Schema Tools
- Generate JSON schemas for any application type
- Validate your JSON data against schemas
- Download schemas for use in your projects
- Built-in data validation with error reporting

### 🔍 Global Search
- Search across all specifications content
- Find applications, modules, fields, and examples
- Advanced filtering and result categorization
- Score-based relevance ranking

## 🚀 Quick Start

```bash
git clone https://github.com/TimHopkin/planning-spec-tool.git
cd planning-spec-tool
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Complete Setup & Usage Guide

**👉 For detailed setup instructions, deployment guide, troubleshooting, and comprehensive usage documentation, see [SETUP-GUIDE.md](./SETUP-GUIDE.md)**

The setup guide covers:
- ✅ System architecture and components
- ✅ Development workflow and best practices  
- ✅ Static deployment to Netlify/other platforms
- ✅ Data structure reference and examples
- ✅ Current limitations and workarounds
- ✅ Troubleshooting common issues
- ✅ Future enhancement possibilities

### Building for Production

```bash
npm run build  # Creates static files in 'out/' directory
```

The build creates a static export suitable for deployment to Netlify, Vercel, or any static hosting platform.

## Project Structure

```
planning-spec-tool/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── applications/      # Application explorer pages
│   │   ├── modules/          # Module browser pages
│   │   ├── fields/           # Field reference pages
│   │   ├── examples/         # Examples gallery
│   │   ├── schema/           # Schema tools
│   │   ├── search/           # Search functionality
│   │   └── docs/             # Documentation
│   ├── components/           # Reusable UI components
│   ├── lib/                 # Utility libraries
│   │   ├── data-parser.ts   # CSV/Markdown parser
│   │   └── schema-generator.ts # JSON schema generator
│   └── types/               # TypeScript type definitions
└── README.md
```

## Key Components

### Data Parser (`src/lib/data-parser.ts`)
- Parses CSV files and Markdown specifications
- Loads planning application types, modules, fields
- Provides search and filtering capabilities
- Singleton pattern for efficient data loading

### Schema Generator (`src/lib/schema-generator.ts`)
- Generates JSON schemas from specification data
- Validates JSON data against schemas
- Creates example data from schemas
- Supports complex validation rules

### API Layer (`src/app/api/`)
- RESTful API endpoints for all data
- Consistent error handling and response format
- Supports filtering and search parameters
- Built on Next.js API routes

## API Reference

### Applications
- `GET /api/applications` - List all application types
- `GET /api/applications/[reference]` - Get specific application details

### Modules
- `GET /api/modules` - List all planning modules
- `GET /api/modules/[reference]` - Get specific module details

### Fields
- `GET /api/fields` - List all field definitions

### Examples
- `GET /api/examples` - List all JSON examples
- `GET /api/examples?applicationType=[ref]` - Filter by application type

### Schema Tools
- `GET /api/schema/[reference]` - Generate schema for application type
- `POST /api/validate` - Validate JSON data against schema

### Search
- `GET /api/search?q=[query]` - Search across all content

## Usage Examples

### Generating a Schema
```javascript
const response = await fetch('/api/schema/full');
const { data: schema } = await response.json();
```

### Validating Data
```javascript
const response = await fetch('/api/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: yourJsonData,
    applicationReference: 'full'
  })
});
const validation = await response.json();
```

### Searching Content
```javascript
const response = await fetch('/api/search?q=householder');
const { data: results } = await response.json();
```

## Data Sources

This tool processes data from the official UK Planning Application Data Specification repository, including:

- `data/planning-application-type.csv` - Application type definitions
- `data/planning-application-module.csv` - Module definitions  
- `specification/field/*.md` - Field definitions
- `specification/component/*.md` - Component definitions
- `specification/example/*.json` - Example data files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Resources

- [Planning Application Data Specification](https://github.com/digital-land/planning-application-data-specification)
- [Planning.data.gov.uk](https://planning.data.gov.uk)
- [Digital Land Platform](https://digital-land.github.io)

## Support

For issues and questions:
- Create an issue in this repository
- Refer to the [official specification discussions](https://github.com/digital-land/planning-application-data-specification/discussions)
- Check the built-in documentation at `/docs`