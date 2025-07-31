import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Planning Modules",
  description: "Browse 50+ reusable planning modules used across different application types. Modular components for applicant details, site information, proposals, and more.",
  openGraph: {
    title: "Planning Modules | Planning Spec Tool",
    description: "Browse 50+ reusable planning modules used across different application types. Modular components for building planning applications.",
    url: "https://planning-spec-tool.netlify.app/modules"
  },
  twitter: {
    title: "Planning Modules",
    description: "Browse 50+ reusable planning modules for building structured planning applications."
  }
};

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}