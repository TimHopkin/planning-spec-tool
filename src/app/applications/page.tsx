'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationType } from '@/types/planning';
import { ApplicationCard } from '@/components/ApplicationCard';
import { SearchBar } from '@/components/SearchBar';
import { Filter, Grid, List } from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'reference'>('name');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchQuery, sortBy]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/applications');
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data);
      } else {
        setError(data.error || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to fetch applications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        app =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.reference.toLowerCase().includes(query)
      );
    }

    // Sort applications
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.reference.localeCompare(b.reference);
      }
    });

    setFilteredApplications(filtered);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-slate-700">Loading applications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading applications</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchApplications}
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
          Planning Application Types
        </h1>
        <p className="text-lg text-slate-700 mb-6">
          Explore all {applications.length} planning application types in the UK specification. 
          Each type has specific requirements, modules, and validation rules.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search applications by name, reference, or description..."
            />
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
                    : 'bg-white text-slate-700 hover:bg-gray-50'
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
                    : 'bg-white text-slate-700 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-slate-700">
          {filteredApplications.length === applications.length
            ? `Showing all ${applications.length} applications`
            : `Showing ${filteredApplications.length} of ${applications.length} applications`}
        </div>
      </div>

      {/* Applications Grid/List */}
      {filteredApplications.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <div className="text-slate-500 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-slate-700 mb-4">
            No applications match your search criteria. Try adjusting your search terms.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.reference}
              application={app}
              showDetails={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
}