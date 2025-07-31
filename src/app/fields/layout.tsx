import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Field Reference",
  description: "Comprehensive reference for 200+ planning application data fields. Includes data types, validation rules, requirements, and detailed descriptions for each field.",
  openGraph: {
    title: "Field Reference | Planning Spec Tool", 
    description: "Comprehensive reference for 200+ planning application data fields with validation rules and requirements.",
    url: "https://planning-spec-tool.netlify.app/fields"
  },
  twitter: {
    title: "Field Reference",
    description: "Comprehensive reference for 200+ planning application data fields with validation rules."
  }
};

export default function FieldsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}