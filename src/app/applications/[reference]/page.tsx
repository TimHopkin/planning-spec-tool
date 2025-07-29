import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProcessedApplication } from '@/types/planning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ModuleCard } from '@/components/ModuleCard';
import { ArrowLeft, ExternalLink, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

async function getApplication(reference: string): Promise<ProcessedApplication | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/applications/${reference}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch application:', error);
    return null;
  }
}

interface ApplicationPageProps {
  params: Promise<{
    reference: string;
  }>;
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { reference } = await params;
  const application = await getApplication(reference);

  if (!application) {
    notFound();
  }

  const { type, subTypes, modules, examples } = application;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/applications" className="hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Applications
        </Link>
        <span>/</span>
        <span className="text-gray-900">{type.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{type.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{type.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Added: {type.entryDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {type.reference}
                </code>
              </div>
            </div>
          </div>
          
          {type.endDate && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Deprecated: {type.endDate}</span>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {type.synonyms && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Also known as:</h4>
                    <p className="text-gray-600">{type.synonyms}</p>
                  </div>
                )}
                
                {type.legislation && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Legislation:</h4>
                    <div className="space-y-2">
                      {type.legislation.split(';').map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          <a
                            href={link.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            {link.trim().replace('https://', '').replace('http://', '')}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {type.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                    <p className="text-gray-600">{type.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sub-types:</span>
                  <span className="font-medium">{subTypes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Required modules:</span>
                  <span className="font-medium">{modules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Examples:</span>
                  <span className="font-medium">{examples.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center gap-1">
                    {type.endDate ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-700 text-sm font-medium">Deprecated</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-700 text-sm font-medium">Active</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sub-types */}
      {subTypes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sub-types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subTypes.map((subType) => (
              <Card key={subType.reference}>
                <CardHeader>
                  <CardTitle className="text-lg">{subType.name}</CardTitle>
                  <CardDescription>{subType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <code className="px-2 py-1 bg-gray-100 rounded">
                      {subType.reference}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Required Modules */}
      {modules.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Required Modules ({modules.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard key={module.reference} module={module} />
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {examples.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            JSON Examples ({examples.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((example) => (
              <Card key={example.reference} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/examples/${example.reference}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {example.name}
                    </Link>
                  </CardTitle>
                  {example.description && (
                    <CardDescription>{example.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <code className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {example.reference}
                    </code>
                    <Link
                      href={`/examples/${example.reference}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View example →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/examples?applicationType=${type.reference}`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Examples
        </Link>
        <Link
          href="/modules"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Browse All Modules
        </Link>
      </div>
    </div>
  );
}