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

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Step-by-Step Setup

1. **Clone the repository and data source:**
```bash
# Clone the tool repository
git clone https://github.com/TimHopkin/planning-spec-tool.git
cd planning-spec-tool

# Clone the planning specification data (required for the tool to work)
cd ..
git clone https://github.com/digital-land/planning-application-data-specification.git
cd planning-spec-tool
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Wait for the server to start completely.** You should see output like:
```
✓ Ready in 1079ms
- Local: http://localhost:3000
```

5. **Access the application:**
   - The development server will automatically try to open your browser
   - If it doesn't open automatically, manually navigate to: **http://localhost:3000**
   - If you see "This site can't be reached" or "Connection refused", wait a few more seconds for the server to fully start

## 🖥️ Starting the Development Server

**Important:** You must start the development server before accessing the application.

```bash
# In your terminal, navigate to the project directory
cd planning-spec-tool

# Start the development server
npm run dev
```

**What to expect:**
- The terminal will show "Starting..." then "Ready in [time]"
- You'll see the local URL (usually http://localhost:3000)
- The server must remain running while you use the application
- Press `Ctrl+C` to stop the server when you're done

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

## 🔧 Troubleshooting

### "This site can't be reached" or "Connection refused"
- **Make sure the development server is running:** Check your terminal for the "Ready" message
- **Wait for complete startup:** The server takes a few seconds to fully initialize
- **Check the port:** The server might be running on a different port if 3000 is busy
- **Restart the server:** Press `Ctrl+C` to stop, then run `npm run dev` again

### "Failed to fetch applications" error
- **Check data directory:** Ensure the `planning-application-data-specification` repository is cloned as a sibling directory
- **Verify file paths:** The data should be in `../planning-application-data-specification/data/`
- **Restart the server:** After fixing data issues, restart with `npm run dev`

### Port already in use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.). Check your terminal output for the correct URL.

### Installation issues
```bash
# Clear npm cache if you encounter package installation errors
npm cache clean --force
npm install
```

### Building for Production

```bash
npm run build  # Creates optimized build
```

**Note:** For production deployment, API routes require a server environment (not static hosting).

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