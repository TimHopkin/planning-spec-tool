import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "JSON Examples",
  description: "Browse 100+ real-world JSON examples for every planning application type and scenario. Copy and use as templates for your planning application implementations.",
  openGraph: {
    title: "JSON Examples | Planning Spec Tool",
    description: "Browse 100+ real-world JSON examples for planning applications. Templates for householder, full planning, and more.",
    url: "https://planning-spec-tool.netlify.app/examples"
  },
  twitter: {
    title: "JSON Examples",
    description: "Browse 100+ real-world JSON examples for planning applications. Copy and use as templates."
  }
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}