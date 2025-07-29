'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchResult } from '@/types/planning';
import { SearchBar } from '@/components/SearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, FileText, Settings, Database, Code, Filter } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
        setHasSearched(true);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Failed to perform search');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = filterType === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === filterType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application': return FileText;
      case 'module': return Settings;
      case 'field': return Database;
      case 'component': return Code;
      case 'example': return Code;
      default: return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application': return 'bg-blue-100 text-blue-800';
      case 'module': return 'bg-green-100 text-green-800';
      case 'field': return 'bg-purple-100 text-purple-800';
      case 'component': return 'bg-orange-100 text-orange-800';
      case 'example': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'application': return 'Application';
      case 'module': return 'Module';
      case 'field': return 'Field';
      case 'component': return 'Component';
      case 'example': return 'Example';
      default: return 'Item';
    }
  };

  const resultTypes = [...new Set(searchResults.map(r => r.type))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Planning Specifications
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Search across all planning application types, modules, fields, components, and examples.
        </p>

        {/* Search Input */}
        <div className="max-w-2xl">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search for applications, modules, fields, examples..."
            className="w-full"
          />
        </div>
      </div>

      {/* Search Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Searching...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="text-red-600">
            <p className="text-lg font-medium">Search Error</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      )}

      {hasSearched && !isLoading && !error && (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredResults.length} of {searchResults.length} results
                {filterType !== 'all' && ` (filtered by ${getTypeName(filterType)})`}
              </p>
            </div>

            {/* Filter by type */}
            {resultTypes.length > 1 && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {resultTypes.map(type => (
                  <option key={type} value={type}>
                    {getTypeName(type)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Results List */}
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((result, index) => {
                const IconComponent = getTypeIcon(result.type);
                return (
                  <Card key={`${result.type}-${result.reference}-${index}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(result.type)}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={result.path}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {result.name}
                            </Link>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(result.type)}`}>
                              {getTypeName(result.type)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-2">
                            {result.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <code className="px-2 py-1 bg-gray-100 rounded">
                              {result.reference}
                            </code>
                            <span>Match score: {Math.round(result.score)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <Link
                            href={result.path}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                No items match your search query "{searchQuery}".
                {filterType !== 'all' && (
                  <span>
                    {' '}Try removing the {getTypeName(filterType)} filter or adjusting your search terms.
                  </span>
                )}
              </p>
              {filterType !== 'all' && (
                <button
                  onClick={() => setFilterType('all')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Show all result types
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
              <CardDescription>
                Get the most out of your searches with these helpful tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">What can you search for?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Application types (e.g., "householder", "full planning")</li>
                    <li>• Planning modules (e.g., "applicant details", "site area")</li>
                    <li>• Field definitions (e.g., "postcode", "reference")</li>
                    <li>• Components and examples</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Search techniques</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use specific terms for better matches</li>
                    <li>• Search by reference codes (e.g., "hh", "full")</li>
                    <li>• Try different variations of terms</li>
                    <li>• Use the filters to narrow down results</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}