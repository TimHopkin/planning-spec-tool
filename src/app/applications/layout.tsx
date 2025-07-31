import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Planning Application Types",
  description: "Explore 18+ official UK planning application types including householder, full planning, listed building consent, and more. Detailed specifications and requirements for each application type.",
  openGraph: {
    title: "Planning Application Types | Planning Spec Tool",
    description: "Explore 18+ official UK planning application types including householder, full planning, listed building consent, and more.",
    url: "https://planning-spec-tool.netlify.app/applications"
  },
  twitter: {
    title: "Planning Application Types",
    description: "Explore 18+ official UK planning application types with detailed specifications and requirements."
  }
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}