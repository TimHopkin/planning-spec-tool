import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Documentation",
  description: "Complete documentation for the Planning Application Data Specification Tool. Setup guides, API references, integration examples, and troubleshooting.",
  openGraph: {
    title: "Documentation | Planning Spec Tool",
    description: "Complete documentation, setup guides, and API references for the Planning Application Data Specification Tool.",
    url: "https://planning-spec-tool.netlify.app/docs"
  },
  twitter: {
    title: "Documentation",
    description: "Complete documentation and setup guides for the Planning Application Data Specification Tool."
  }
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}