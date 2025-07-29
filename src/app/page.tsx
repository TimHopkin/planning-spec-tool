import Link from 'next/link';
import { ApplicationCard } from '@/components/ApplicationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Settings, Database, Code, Search, BookOpen, ArrowRight } from 'lucide-react';

async function getApplications() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/applications`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.success ? data.data.slice(0, 6) : [];
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return [];
  }
}

async function getModules() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/modules`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.success ? data.data.slice(0, 3) : [];
  } catch (error) {
    console.error('Failed to fetch modules:', error);
    return [];
  }
}

export default async function Home() {
  const applications = await getApplications();
  const modules = await getModules();

  const features = [
    {
      title: 'Application Types',
      description: 'Explore 18+ planning application types with detailed specifications',
      icon: FileText,
      href: '/applications',
      color: 'bg-blue-500'
    },
    {
      title: 'Planning Modules',
      description: 'Browse modular components used across different application types',
      icon: Settings,
      href: '/modules',
      color: 'bg-green-500'
    },
    {
      title: 'Field Reference',
      description: 'Comprehensive field definitions with validation rules and data types',
      icon: Database,
      href: '/fields',
      color: 'bg-purple-500'
    },
    {
      title: 'JSON Examples',
      description: 'Real-world JSON examples for every application type and scenario',
      icon: Code,
      href: '/examples',
      color: 'bg-orange-500'
    },
    {
      title: 'Search & Discovery',
      description: 'Powerful search across all specifications, fields, and examples',
      icon: Search,
      href: '/search',
      color: 'bg-red-500'
    },
    {
      title: 'Documentation',
      description: 'Complete documentation and integration guides',
      icon: BookOpen,
      href: '/docs',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Planning Application Data Specification Tool
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Interactive tool for exploring the UK government's standardized planning application data specifications. 
          Navigate 18+ application types, hundreds of fields, and comprehensive examples.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/applications"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Explore Applications
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Code className="w-5 h-5 mr-2" />
            View Examples
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Application Types</h2>
          <Link
            href="/applications"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View all applications
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <ApplicationCard key={app.reference} application={app} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">18+</div>
            <div className="text-sm text-gray-600">Application Types</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
            <div className="text-sm text-gray-600">Planning Modules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">200+</div>
            <div className="text-sm text-gray-600">Field Definitions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">100+</div>
            <div className="text-sm text-gray-600">JSON Examples</div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Learn how to use the planning application data specifications in your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-medium mb-2">Explore Applications</h3>
              <p className="text-sm text-gray-600">
                Browse the different planning application types and understand their requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <h3 className="font-medium mb-2">Review Examples</h3>
              <p className="text-sm text-gray-600">
                Study real JSON examples to understand the data structure and formatting
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-medium mb-2">Implement</h3>
              <p className="text-sm text-gray-600">
                Use the schemas and validation rules to implement the specifications in your system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}