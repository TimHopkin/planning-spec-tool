'use client';

import React, { useState, useEffect } from 'react';
import { Field } from '@/types/planning';
import { FieldCard } from '@/components/FieldCard';
import { SearchBar } from '@/components/SearchBar';
import { Filter, Grid, List } from 'lucide-react';

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [filteredFields, setFilteredFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'reference' | 'dataType'>('name');
  const [filterByType, setFilterByType] = useState<string>('all');
  const [filterByRequired, setFilterByRequired] = useState<string>('all');

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    filterAndSortFields();
  }, [fields, searchQuery, sortBy, filterByType, filterByRequired]);

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/data/fields.json');
      const data = await response.json();
      
      if (data.success) {
        setFields(data.data);
      } else {
        setError(data.error || 'Failed to fetch fields');
      }
    } catch (err) {
      setError('Failed to fetch fields');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortFields = () => {
    let filtered = [...fields];

    // Filter by data type
    if (filterByType !== 'all') {
      filtered = filtered.filter(field => field.dataType.toLowerCase() === filterByType);
    }

    // Filter by required status
    if (filterByRequired === 'required') {
      filtered = filtered.filter(field => field.required);
    } else if (filterByRequired === 'optional') {
      filtered = filtered.filter(field => !field.required);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        field =>
          field.name.toLowerCase().includes(query) ||
          field.description.toLowerCase().includes(query) ||
          field.reference.toLowerCase().includes(query) ||
          field.dataType.toLowerCase().includes(query)
      );
    }

    // Sort fields
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reference':
          return a.reference.localeCompare(b.reference);
        case 'dataType':
          return a.dataType.localeCompare(b.dataType);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredFields(filtered);
  };

  const dataTypes = [...new Set(fields.map(f => f.dataType.toLowerCase()))].sort();
  const requiredFields = fields.filter(f => f.required).length;
  const optionalFields = fields.filter(f => !f.required).length;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-800">Loading fields...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading fields</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchFields}
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
          Field Reference
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Comprehensive reference of all field definitions used across planning applications. 
          Each field includes data types, validation rules, and usage requirements.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{fields.length}</div>
            <div className="text-sm text-gray-800">Total Fields</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{requiredFields}</div>
            <div className="text-sm text-gray-800">Required</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-800">{optionalFields}</div>
            <div className="text-sm text-gray-800">Optional</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{dataTypes.length}</div>
            <div className="text-sm text-gray-800">Data Types</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search fields by name, reference, or description..."
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter by data type */}
            <select
              value={filterByType}
              onChange={(e) => setFilterByType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {dataTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Filter by required status */}
            <select
              value={filterByRequired}
              onChange={(e) => setFilterByRequired(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Fields</option>
              <option value="required">Required Only</option>
              <option value="optional">Optional Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'reference' | 'dataType')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="reference">Sort by Reference</option>
              <option value="dataType">Sort by Type</option>
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
          {filteredFields.length === fields.length
            ? `Showing all ${fields.length} fields`
            : `Showing ${filteredFields.length} of ${fields.length} fields`}
        </div>
      </div>

      {/* Fields Grid/List */}
      {filteredFields.length === 0 && (searchQuery || filterByType !== 'all' || filterByRequired !== 'all') ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
          <p className="text-gray-800 mb-4">
            No fields match your current filters. Try adjusting your search or filter criteria.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
            <button
              onClick={() => {
                setFilterByType('all');
                setFilterByRequired('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
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
          {filteredFields.map((field) => (
            <FieldCard
              key={field.reference}
              field={field}
              showDetails={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
}