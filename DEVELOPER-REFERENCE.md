# Developer Quick Reference

## 🚀 Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build static export to 'out/'
npm run lint         # Run ESLint (disabled in builds)

# Deployment
git add . && git commit -m "message" && git push  # Triggers Netlify build
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/data-parser.ts` | Loads CSV/Markdown data, search functions |
| `src/lib/schema-generator.ts` | JSON schema generation (limited in static) |
| `src/types/planning.ts` | TypeScript type definitions |
| `next.config.ts` | Static export configuration |
| `netlify.toml` | Deployment settings |

## 🗂️ Data Sources

| Location | Content |
|----------|---------|
| `../data/*.csv` | Application types, modules, field data |
| `../specification/field/*.md` | 200+ field definitions |
| `../specification/module/*.md` | 50+ module definitions |
| `../specification/example/*.json` | 100+ JSON examples |

## 🔧 Current Limitations

- ❌ No API routes (static export only)
- ❌ No dynamic routing `[reference]` pages
- ❌ No server-side rendering
- ✅ All data processing client-side
- ✅ Static deployment to Netlify/Vercel

## 🛠️ Common Tasks

### Adding New Page
```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>
}
```

### Adding New Component
```typescript
// src/components/NewComponent.tsx
interface Props {
  title: string;
}

export default function NewComponent({ title }: Props) {
  return <div className="p-4">{title}</div>
}
```

### Accessing Data
```typescript
import { DataParser } from '@/lib/data-parser'

const dataParser = DataParser.getInstance()
const applications = await dataParser.getApplications()
const modules = await dataParser.getModules()
const fields = await dataParser.getFields()
```

## 🎨 Styling

Uses **Tailwind CSS** with utility classes:
```typescript
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold text-gray-900 mb-2">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

## 🔍 Search Implementation

Client-side search with scoring:
```typescript
const results = dataParser.search(query, {
  types: ['applications', 'modules', 'fields'],
  limit: 50
})
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` | UI library |
| `tailwindcss` | CSS framework |
| `lucide-react` | Icons |
| `gray-matter` | Markdown parsing |
| `csv-parser` | CSV processing |
| `ajv` | JSON validation |

## 🌐 URLs

- **Development**: http://localhost:3000
- **Production**: https://your-site.netlify.app
- **GitHub**: https://github.com/TimHopkin/planning-spec-tool

## 📞 Help

- 📖 Full guide: [SETUP-GUIDE.md](./SETUP-GUIDE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/TimHopkin/planning-spec-tool/issues)
- 💬 Discussions: [Planning Spec Discussions](https://github.com/digital-land/planning-application-data-specification/discussions)