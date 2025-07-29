# Planning Application Data Specification Tool - Complete Setup & Usage Guide

## 🏗️ System Overview

This system provides a comprehensive web-based tool for exploring and working with the UK Planning Application Data Specification. It consists of two main components:

1. **Core Specification Data** - Official planning application data specifications, examples, and field definitions
2. **Web Application Tool** - Next.js-based interface for browsing, searching, and working with the specification data

### 🎯 Key Features

- **Interactive Application Explorer** - Browse 18+ planning application types with detailed requirements
- **Planning Modules Browser** - Explore 50+ reusable planning modules and their relationships  
- **Comprehensive Field Reference** - Browse 200+ field definitions with validation rules
- **JSON Examples Gallery** - Access 100+ real-world JSON examples for each application type
- **Schema Tools** - Generate and validate JSON schemas (currently limited in static deployment)
- **Global Search** - Search across all specification content with advanced filtering

## 📋 Prerequisites

Before setting up the system, ensure you have:

- **Node.js 18+** (required for Next.js 15)
- **npm 10+** or **yarn** package manager
- **Git** for version control
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/TimHopkin/planning-spec-tool.git
cd planning-spec-tool
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at **http://localhost:3000**

## 🏗️ Detailed System Architecture

### Directory Structure

```
planning-application-data-specification-main/
├── planning-spec-tool/          # Next.js Web Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── applications/    # Application type explorer
│   │   │   ├── modules/         # Module browser
│   │   │   ├── fields/          # Field reference
│   │   │   ├── examples/        # JSON examples gallery
│   │   │   ├── schema/          # Schema generation tools
│   │   │   ├── search/          # Global search functionality
│   │   │   └── docs/            # Documentation pages
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                 # Core utilities and parsers
│   │   │   ├── data-parser.ts   # CSV/Markdown data processor
│   │   │   ├── schema-generator.ts # JSON schema generator
│   │   │   └── utils.ts         # Utility functions
│   │   └── types/               # TypeScript definitions
│   ├── public/                  # Static assets
│   ├── package.json             # Dependencies and scripts
│   ├── next.config.ts           # Next.js configuration
│   ├── netlify.toml             # Netlify deployment config
│   └── README.md                # Project documentation
├── data/                        # Core specification data
│   ├── planning-application-type.csv
│   ├── planning-application-module.csv
│   ├── planning-application-sub-type.csv
│   └── specification/
│       └── field_data.csv
├── specification/               # Detailed specifications
│   ├── application/             # Application type definitions
│   ├── component/               # Component definitions
│   ├── field/                   # Field definitions (200+ files)
│   ├── module/                  # Module definitions (50+ files)
│   ├── example/                 # JSON examples (100+ files)
│   └── codelist/                # Code list definitions
└── docs/                        # Additional documentation
```

### Core Components

#### 1. Data Parser (`src/lib/data-parser.ts`)
- **Purpose**: Processes CSV files and Markdown specifications into structured data
- **Functions**: 
  - Loads planning application types, modules, and fields
  - Provides search and filtering capabilities
  - Implements singleton pattern for efficient data loading
- **Data Sources**: CSV files from `/data/` and Markdown files from `/specification/`

#### 2. Schema Generator (`src/lib/schema-generator.ts`)
- **Purpose**: Generates JSON schemas from specification data
- **Functions**:
  - Creates JSON schemas for any application type
  - Validates JSON data against schemas
  - Generates example data structures
- **Note**: Currently limited in static deployment due to complex processing requirements

#### 3. UI Components (`src/components/`)
- **ApplicationCard**: Displays application type information
- **ModuleCard**: Shows module details and relationships
- **FieldCard**: Presents field definitions and validation rules
- **SearchBar**: Provides search functionality across all content
- **Navigation**: Main site navigation and routing

## 💻 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (static export)
npm run start        # Start production server (not used in static deployment)
npm run lint         # Run ESLint (currently disabled in builds)
```

### Development Server Features

- **Hot Module Replacement**: Instant updates during development
- **Turbopack**: Fast bundling and compilation
- **TypeScript Support**: Full type checking and IntelliSense
- **Tailwind CSS**: Utility-first styling with live reloading

### Working with Specification Data

The system automatically loads data from the parent directory structure:

1. **CSV Data Loading**: Application types, modules, and basic field data from `/data/`
2. **Markdown Processing**: Detailed specifications from `/specification/`
3. **Example Processing**: JSON examples from `/specification/example/`

### Code Structure Guidelines

- **Pages**: Use App Router structure in `src/app/`
- **Components**: Create reusable components in `src/components/`
- **Utilities**: Add data processing functions to `src/lib/`
- **Types**: Define TypeScript interfaces in `src/types/`
- **Styling**: Use Tailwind CSS classes with `clsx` for conditional styling

## 🌐 Deployment Guide

### Current Configuration: Static Export

The system is configured for static deployment to platforms like Netlify:

#### Next.js Configuration (`next.config.ts`)
```typescript
const nextConfig: NextConfig = {
  output: 'export',           // Generate static files
  trailingSlash: true,        // Ensure proper routing
  images: {
    unoptimized: true         // Disable image optimization for static hosting
  },
  eslint: {
    ignoreDuringBuilds: true  // Skip linting during build
  },
  typescript: {
    ignoreBuildErrors: true   // Skip TypeScript errors during build
  }
};
```

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "10"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deployment Steps

#### To Netlify (Recommended)

1. **Push to GitHub**: Ensure your code is pushed to GitHub
2. **Connect Netlify**: 
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
3. **Configure Build**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18
4. **Deploy**: Netlify will automatically build and deploy

#### To Other Static Hosts

The built files in the `out/` directory can be deployed to:
- **Vercel**: Upload the `out` folder
- **GitHub Pages**: Push `out` contents to `gh-pages` branch
- **AWS S3**: Upload `out` contents to S3 bucket
- **Any static hosting service**

### Build Process

```bash
npm run build
```

This creates:
- Static HTML files for all pages
- Optimized CSS and JavaScript bundles
- All assets in the `out/` directory
- Pre-rendered content for immediate loading

## ⚠️ Current Limitations & Workarounds

### Removed Features (for Static Compatibility)

1. **API Routes**: Removed `/api/*` endpoints
   - **Impact**: No server-side data processing
   - **Workaround**: All data processing happens client-side

2. **Dynamic Routing**: Removed `[reference]` pages
   - **Impact**: No individual application detail pages
   - **Workaround**: All information displayed on main category pages

3. **Server-Side Rendering**: No SSR capabilities
   - **Impact**: All content is static
   - **Workaround**: Pre-build all content during build process

### Known Issues

1. **Large Bundle Size**: All specification data loaded client-side
2. **Search Performance**: Client-side search may be slower with large datasets
3. **No Real-time Updates**: Content updates require rebuilding and redeployment

### Recommended Enhancements

For a more robust system, consider:

1. **Add API Routes**: Implement server-side data processing
2. **Database Integration**: Store specification data in a database
3. **Dynamic Content**: Re-enable dynamic routing for detailed views
4. **Search Optimization**: Implement server-side search with indexing
5. **Content Management**: Add ability to update specifications through the interface

## 📚 Data Structure Reference

### Application Types
- **File**: `data/planning-application-type.csv`
- **Fields**: reference, name, description, status
- **Examples**: full, hh (householder), outline, lbc (listed building consent)

### Planning Modules
- **File**: `data/planning-application-module.csv`  
- **Fields**: reference, name, description, status
- **Examples**: applicant-details, agent-contact, site-location

### Field Definitions
- **Location**: `specification/field/*.md`
- **Format**: Markdown with frontmatter metadata
- **Content**: Description, data type, validation rules, examples

### JSON Examples
- **Location**: `specification/example/*.json`
- **Naming**: Descriptive names indicating the scenario
- **Content**: Complete JSON structures showing real-world usage

## 🔍 Usage Examples

### Exploring Application Types

1. **Browse Applications**: Visit `/applications` to see all planning application types
2. **Filter by Status**: Use the status filter to show active/deprecated applications
3. **Search Applications**: Use the search bar to find specific application types
4. **View Requirements**: Click on any application to see required modules and fields

### Understanding Modules

1. **Module Browser**: Visit `/modules` to explore all planning modules
2. **Dependencies**: See which applications require each module
3. **Module Details**: View field requirements and relationships
4. **Status Tracking**: Identify deprecated or proposed modules

### Working with Fields

1. **Field Reference**: Visit `/fields` to browse all field definitions
2. **Data Types**: Filter fields by data type (string, boolean, number, etc.)
3. **Validation Rules**: Understand requirements and constraints
4. **Usage Context**: See which modules and applications use each field

### Using Examples

1. **Example Gallery**: Visit `/examples` to browse JSON examples
2. **Filter by Type**: Show examples for specific application types
3. **Copy Examples**: Use examples as templates for your implementations
4. **Understand Structure**: See how fields and modules combine in practice

### Global Search

1. **Search Everything**: Use the main search to find content across all specifications
2. **Filter Results**: Narrow results by content type (applications, modules, fields, examples)
3. **Relevance Ranking**: Results are ranked by relevance to your search terms

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
- **Cause**: TypeScript or linting errors
- **Solution**: Errors are currently ignored in build; fix for development

#### Data Loading Issues
- **Cause**: Missing or malformed CSV/Markdown files
- **Solution**: Verify parent directory structure contains specification data

#### Search Not Working
- **Cause**: Client-side search limitations
- **Solution**: Reduce search terms, use filters to narrow results

#### Missing Content
- **Cause**: Static export limitations
- **Solution**: Some dynamic features removed; check if content exists in source data

### Performance Issues

#### Slow Loading
- **Cause**: Large client-side data loading
- **Solution**: Consider implementing lazy loading or pagination

#### Search Performance
- **Cause**: Client-side processing of large datasets
- **Solution**: Consider server-side search implementation

## 🚀 Future Enhancements

### Immediate Improvements
1. **Re-enable API Routes**: For server-side processing
2. **Add Dynamic Routing**: For detailed individual pages
3. **Implement Caching**: For better performance
4. **Add Data Validation**: For specification integrity

### Long-term Goals
1. **Content Management**: Allow editing specifications through the interface
2. **Version Control**: Track changes to specifications over time
3. **Collaboration Features**: Multiple user editing and review
4. **Integration APIs**: Connect with planning authority systems

## 📞 Support & Contributing

### Getting Help
- **Issues**: Create issues in the GitHub repository
- **Documentation**: Check the `/docs` directory for additional information
- **Community**: Refer to [official specification discussions](https://github.com/digital-land/planning-application-data-specification/discussions)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Related Resources
- [Planning Application Data Specification](https://github.com/digital-land/planning-application-data-specification)
- [Planning.data.gov.uk](https://planning.data.gov.uk)
- [Digital Land Platform](https://digital-land.github.io)

---

*This documentation covers the current state of the system as configured for static deployment. For questions about restoring full functionality or implementing enhancements, please refer to the contributing guidelines or create an issue in the repository.*