import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Schema Tools",
  description: "Generate and validate JSON schemas for planning applications. Tools for schema generation, data validation, and ensuring compliance with UK planning data specifications.",
  openGraph: {
    title: "Schema Tools | Planning Spec Tool",
    description: "Generate and validate JSON schemas for planning applications. Ensure compliance with UK planning data specifications.",
    url: "https://planning-spec-tool.netlify.app/schema"
  },
  twitter: {
    title: "Schema Tools",
    description: "Generate and validate JSON schemas for planning applications. Ensure compliance with specifications."
  }
};

export default function SchemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}