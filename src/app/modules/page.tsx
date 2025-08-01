'use client';

import React, { useState, useEffect } from 'react';
import { PlanningModule } from '@/types/planning';
import { ModuleCard } from '@/components/ModuleCard';
import { SearchBar } from '@/components/SearchBar';
import { Filter, Grid, List } from 'lucide-react';

export default function ModulesPage() {
  const [modules, setModules] = useState<PlanningModule[]>([]);
  const [filteredModules, setFilteredModules] = useState<PlanningModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'reference'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'deprecated'>('active');

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    filterAndSortModules();
  }, [modules, searchQuery, sortBy, filterBy]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/data/modules.json');
      const data = await response.json();
      
      if (data.success) {
        setModules(data.data);
      } else {
        setError(data.error || 'Failed to fetch modules');
      }
    } catch (err) {
      setError('Failed to fetch modules');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortModules = () => {
    let filtered = [...modules];

    // Filter by status
    if (filterBy === 'active') {
      filtered = filtered.filter(module => !module.endDate);
    } else if (filterBy === 'deprecated') {
      filtered = filtered.filter(module => module.endDate);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        module =>
          module.name.toLowerCase().includes(query) ||
          module.description.toLowerCase().includes(query) ||
          module.reference.toLowerCase().includes(query)
      );
    }

    // Sort modules
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.reference.localeCompare(b.reference);
      }
    });

    setFilteredModules(filtered);
  };

  const activeModules = modules.filter(m => !m.endDate).length;
  const deprecatedModules = modules.filter(m => m.endDate).length;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-800">Loading modules...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading modules</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchModules}
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
          Planning Modules
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Explore the modular components used across different planning application types. 
          Modules define reusable sections like applicant details, site information, and specific requirements.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
            <div className="text-sm text-gray-800">Total Modules</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{activeModules}</div>
            <div className="text-sm text-gray-800">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">{deprecatedModules}</div>
            <div className="text-sm text-gray-800">Deprecated</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">
              {modules.filter(m => m.replacedBy).length}
            </div>
            <div className="text-sm text-gray-800">Replaced</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search modules by name, reference, or description..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter by status */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'active' | 'deprecated')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Modules</option>
              <option value="active">Active Only</option>
              <option value="deprecated">Deprecated Only</option>
            </select>

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
          {filteredModules.length === modules.length
            ? `Showing all ${modules.length} modules`
            : `Showing ${filteredModules.length} of ${modules.length} modules`}
        </div>
      </div>

      {/* Modules Grid/List */}
      {filteredModules.length === 0 && (searchQuery || filterBy !== 'all') ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-800 mb-4">
            No modules match your current filters. Try adjusting your search or filter criteria.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
            <button
              onClick={() => setFilterBy('all')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Show all modules
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
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.reference}
              module={module}
              showDetails={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
}