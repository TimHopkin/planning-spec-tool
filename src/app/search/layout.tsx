import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Search",
  description: "Search across all planning application specifications, modules, fields, and examples. Find the information you need quickly with advanced filtering and categorization.",
  openGraph: {
    title: "Search | Planning Spec Tool",
    description: "Search across all planning application specifications, modules, fields, and examples with advanced filtering.",
    url: "https://planning-spec-tool.netlify.app/search"
  },
  twitter: {
    title: "Search",
    description: "Search across all planning application specifications with advanced filtering and categorization."
  }
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}