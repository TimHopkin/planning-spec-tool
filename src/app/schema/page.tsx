'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationType } from '@/types/planning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Download, Copy, CheckCircle, XCircle, Play } from 'lucide-react';

export default function SchemaPage() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [schema, setSchema] = useState<any>(null);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const [validationData, setValidationData] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoadingApps(true);
      const response = await fetch('/api/applications');
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data);
        if (data.data.length > 0) {
          setSelectedApp(data.data[0].reference);
        }
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const generateSchema = async () => {
    if (!selectedApp) return;

    try {
      setIsLoadingSchema(true);
      const response = await fetch(`/api/schema/${selectedApp}`);
      const data = await response.json();
      
      if (data.success) {
        setSchema(data.data);
      } else {
        console.error('Failed to generate schema:', data.error);
      }
    } catch (error) {
      console.error('Failed to generate schema:', error);
    } finally {
      setIsLoadingSchema(false);
    }
  };

  const validateData = async () => {
    if (!selectedApp || !validationData.trim()) return;

    try {
      setIsValidating(true);
      const parsedData = JSON.parse(validationData);
      
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: parsedData,
          applicationReference: selectedApp
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setValidationResult(result.data);
      } else {
        console.error('Validation failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to parse or validate data:', error);
      setValidationResult({
        valid: false,
        errors: ['Invalid JSON format']
      });
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadSchema = () => {
    if (!schema) return;
    
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedApp}-schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateExampleData = () => {
    // Generate a basic example based on the selected application
    const exampleData = {
      reference: "550e8400-e29b-41d4-a716-446655440000",
      "application-types": [selectedApp],
      "planning-authority": "example-authority",
      "submission-date": "2024-01-15",
      modules: ["applicant-details", "agent-details"],
      documents: [
        {
          reference: "DOC-001",
          name: "Site Plan",
          description: "Detailed site plan showing proposed development",
          "document-types": ["site-plan"],
          file: {
            filename: "site-plan.pdf",
            "mime-type": "application/pdf",
            "file-size": 1024000
          }
        }
      ]
    };
    
    setValidationData(JSON.stringify(exampleData, null, 2));
  };

  if (isLoadingApps) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-800">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Schema Generator & Validator
        </h1>
        <p className="text-lg text-gray-800">
          Generate JSON schemas for planning applications and validate your data against the specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schema Generation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate JSON Schema</CardTitle>
              <CardDescription>
                Select an application type to generate its JSON schema specification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Application Type
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedApp}
                    onChange={(e) => setSelectedApp(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {applications.map((app) => (
                      <option key={app.reference} value={app.reference}>
                        {app.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={generateSchema}
                    disabled={isLoadingSchema || !selectedApp}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingSchema ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>

              {schema && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Generated Schema
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-800 hover:text-gray-900"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      <button
                        onClick={downloadSchema}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-800 hover:text-gray-900"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 border">
                    {JSON.stringify(schema, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Validation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Validator</CardTitle>
              <CardDescription>
                Validate your JSON data against the selected application schema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    JSON Data to Validate
                  </label>
                  <button
                    onClick={generateExampleData}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Generate Example
                  </button>
                </div>
                <textarea
                  value={validationData}
                  onChange={(e) => setValidationData(e.target.value)}
                  placeholder="Paste your JSON data here..."
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <button
                onClick={validateData}
                disabled={isValidating || !validationData.trim() || !selectedApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {isValidating ? 'Validating...' : 'Validate Data'}
              </button>

              {validationResult && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {validationResult.valid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      validationResult.valid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {validationResult.valid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>

                  {!validationResult.valid && validationResult.errors?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
                      <ul className="space-y-1">
                        {validationResult.errors.map((error: string, index: number) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-1">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResult.valid && (
                    <p className="text-sm text-green-600">
                      Your data conforms to the {selectedApp} application schema.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-gray-900">1. Generate Schema</h3>
              <p className="text-sm text-gray-800">
                Select an application type and click "Generate" to create its JSON schema. 
                This schema defines the structure and validation rules for that application type.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-gray-900">2. Prepare Your Data</h3>
              <p className="text-sm text-gray-800">
                Format your planning application data as JSON. You can use the "Generate Example" 
                button to get a template, then modify it with your actual data.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-gray-900">3. Validate</h3>
              <p className="text-sm text-gray-800">
                Click "Validate Data" to check if your JSON conforms to the schema. 
                Any errors will be clearly highlighted to help you fix issues.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}