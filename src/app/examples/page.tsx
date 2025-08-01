'use client';

import React, { useState, useEffect } from 'react';
import { ExampleData, ApplicationType } from '@/types/planning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { SearchBar } from '@/components/SearchBar';
import { Copy, Download, Eye, Filter, Grid, List } from 'lucide-react';

export default function ExamplesPage() {
  const [examples, setExamples] = useState<ExampleData[]>([]);
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [filteredExamples, setFilteredExamples] = useState<ExampleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'reference'>('name');
  const [selectedExample, setSelectedExample] = useState<ExampleData | null>(null);

  useEffect(() => {
    Promise.all([fetchExamples(), fetchApplications()]);
  }, []);

  useEffect(() => {
    filterAndSortExamples();
  }, [examples, searchQuery, selectedApp, sortBy]);

  const fetchExamples = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/data/examples.json');
      const data = await response.json();
      
      if (data.success) {
        setExamples(data.data);
      } else {
        setError(data.error || 'Failed to fetch examples');
      }
    } catch (err) {
      setError('Failed to fetch examples');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/data/applications.json');
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const filterAndSortExamples = () => {
    let filtered = [...examples];

    // Filter by application type
    if (selectedApp !== 'all') {
      filtered = filtered.filter(example => example.applicationType === selectedApp);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        example =>
          example.name.toLowerCase().includes(query) ||
          example.description.toLowerCase().includes(query) ||
          example.reference.toLowerCase().includes(query) ||
          example.applicationType.toLowerCase().includes(query)
      );
    }

    // Sort examples
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.reference.localeCompare(b.reference);
      }
    });

    setFilteredExamples(filtered);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadExample = (example: ExampleData) => {
    const blob = new Blob([JSON.stringify(example.data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${example.reference}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getApplicationName = (reference: string) => {
    const app = applications.find(a => a.reference === reference);
    return app?.name || reference;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-800">Loading examples...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading examples</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchExamples}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          JSON Examples
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Browse real-world JSON examples for planning applications. 
          Use these as templates or reference implementations for your projects.
        </p>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search examples by name, reference, or description..."
              />
            </div>
            
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Application Types</option>
              {applications.map((app) => (
                <option key={app.reference} value={app.reference}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'reference')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="reference">Sort by Reference</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-800">
          {filteredExamples.length === examples.length
            ? `Showing all ${examples.length} examples`
            : `Showing ${filteredExamples.length} of ${examples.length} examples`}
        </div>
      </div>

      {/* Examples Grid/List */}
      {filteredExamples.length === 0 && (searchQuery || selectedApp !== 'all') ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No examples found</h3>
          <p className="text-gray-800 mb-4">
            No examples match your current filters. Try adjusting your search or filter criteria.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
            <button
              onClick={() => setSelectedApp('all')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Show all examples
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredExamples.map((example) => (
            <Card key={example.reference} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{example.name}</CardTitle>
                    {example.description && (
                      <CardDescription className="mt-1">
                        {example.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {getApplicationName(example.applicationType)}
                  </span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {example.reference}
                  </code>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">
                    {Object.keys(example.data).length} properties
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedExample(example)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                      title="View example"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(example.data, null, 2))}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-gray-800 hover:text-gray-900"
                      title="Copy JSON"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadExample(example)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-gray-800 hover:text-gray-900"
                      title="Download JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Example Detail Modal */}
      {selectedExample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">{selectedExample.name}</h2>
                <p className="text-sm text-gray-800 mt-1">
                  {getApplicationName(selectedExample.applicationType)} Example
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedExample.data, null, 2))}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => downloadExample(selectedExample)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setSelectedExample(null)}
                  className="text-gray-600 hover:text-gray-800 text-xl font-bold px-2"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(selectedExample.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}