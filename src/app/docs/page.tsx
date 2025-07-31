import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, FileText, Code, Database, Settings, Search, ExternalLink } from 'lucide-react';

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of the planning application data specification',
      icon: BookOpen,
      items: [
        { title: 'Overview', description: 'Introduction to the UK planning application data specification', href: '#overview' },
        { title: 'Application Types', description: 'Understanding different types of planning applications', href: '/applications' },
        { title: 'Data Structure', description: 'How planning application data is organized', href: '#data-structure' },
        { title: 'Quick Start Guide', description: 'Get up and running with the specifications', href: '#quick-start' }
      ]
    },
    {
      title: 'API Reference',
      description: 'Technical documentation for developers',
      icon: Code,
      items: [
        { title: 'REST API Endpoints', description: 'Complete API documentation', href: '#api-endpoints' },
        { title: 'JSON Schemas', description: 'Schema generation and validation', href: '/schema' },
        { title: 'Data Validation', description: 'Validating your planning application data', href: '#validation' },
        { title: 'Authentication', description: 'API authentication methods', href: '#authentication' }
      ]
    },
    {
      title: 'Field Reference',
      description: 'Complete field definitions and data types',
      icon: Database,
      items: [
        { title: 'All Fields', description: 'Browse all field definitions', href: '/fields' },
        { title: 'Data Types', description: 'Understanding field data types', href: '#data-types' },
        { title: 'Validation Rules', description: 'Field validation requirements', href: '#validation-rules' },
        { title: 'Required vs Optional', description: 'Understanding field requirements', href: '#field-requirements' }
      ]
    },
    {
      title: 'Implementation Guides',
      description: 'Best practices and implementation examples',
      icon: Settings,
      items: [
        { title: 'Integration Guide', description: 'How to integrate the specifications', href: '#integration' },
        { title: 'Best Practices', description: 'Recommended implementation patterns', href: '#best-practices' },
        { title: 'Error Handling', description: 'Handling validation errors', href: '#error-handling' },
        { title: 'Testing', description: 'Testing your implementation', href: '#testing' }
      ]
    }
  ];

  const resources = [
    {
      title: 'GitHub Repository',
      description: 'View the source specification files',
      href: 'https://github.com/digital-land/planning-application-data-specification',
      external: true
    },
    {
      title: 'Planning.data.gov.uk',
      description: 'Official planning data portal',
      href: 'https://planning.data.gov.uk',
      external: true
    },
    {
      title: 'JSON Examples',
      description: 'Browse real-world examples',
      href: '/examples',
      external: false
    },
    {
      title: 'Schema Generator',
      description: 'Generate and validate schemas',
      href: '/schema',
      external: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Documentation
        </h1>
        <p className="text-xl text-slate-700 max-w-3xl">
          Complete documentation for the UK Planning Application Data Specification. 
          Learn how to implement, validate, and work with standardized planning application data.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-12" id="overview">
        <Card>
          <CardHeader>
            <CardTitle>What is the Planning Application Data Specification?</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-slate-700 mb-4">
              The Planning Application Data Specification is a UK government initiative led by the 
              Ministry of Housing, Communities and Local Government (MHCLG) to standardize the data 
              exchanged when planning applications are submitted.
            </p>
            <p className="text-slate-700 mb-4">
              The specification consists of modular components that define the structure, validation 
              rules, and requirements for different types of planning applications, from simple 
              householder extensions to complex full planning applications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">18+ Application Types</h3>
                <p className="text-sm text-slate-700">From householder to full planning</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Settings className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">50+ Modules</h3>
                <p className="text-sm text-slate-700">Reusable components and sections</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium">200+ Fields</h3>
                <p className="text-sm text-slate-700">Comprehensive field definitions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-700">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Start Guide */}
      <div className="mb-12" id="quick-start">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Get started with the planning application data specification in three simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-medium mb-2">Explore Application Types</h3>
                <p className="text-sm text-slate-700 mb-4">
                  Browse the different planning application types to understand their specific requirements and modules.
                </p>
                <Link
                  href="/applications"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Applications →
                </Link>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-medium mb-2">Study Examples</h3>
                <p className="text-sm text-slate-700 mb-4">
                  Review real JSON examples to understand the data structure and formatting requirements.
                </p>
                <Link
                  href="/examples"
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  Browse Examples →
                </Link>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-medium mb-2">Generate & Validate</h3>
                <p className="text-sm text-slate-700 mb-4">
                  Use the schema generator to create validation schemas and test your implementation.
                </p>
                <Link
                  href="/schema"
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  Schema Tools →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Card key={resource.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-slate-700">{resource.description}</p>
                  </div>
                  <div className="ml-4">
                    {resource.external ? (
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    ) : (
                      <Link
                        href={resource.href}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Search className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Need Help */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Get support and contribute to the planning application data specification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Community Support</h3>
              <p className="text-sm text-slate-700 mb-3">
                Join the discussion and get help from the community of developers and planning professionals.
              </p>
              <a
                href="https://github.com/digital-land/planning-application-data-specification/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View Discussions →
              </a>
            </div>
            <div>
              <h3 className="font-medium mb-2">Report Issues</h3>
              <p className="text-sm text-slate-700 mb-3">
                Found a bug or have suggestions for improvement? Report issues on GitHub.
              </p>
              <a
                href="https://github.com/digital-land/planning-application-data-specification/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Report Issue →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}