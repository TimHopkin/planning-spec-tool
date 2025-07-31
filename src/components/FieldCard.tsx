import React from 'react';
import { Field } from '@/types/planning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tag, AlertCircle, CheckCircle } from 'lucide-react';

interface FieldCardProps {
  field: Field;
  showDetails?: boolean;
}

export function FieldCard({ field, showDetails = false }: FieldCardProps) {
  const getDataTypeColor = (dataType: string) => {
    switch (dataType.toLowerCase()) {
      case 'string': return 'bg-blue-100 text-blue-800';
      case 'number': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      case 'date': return 'bg-orange-100 text-orange-800';
      case 'uuid': return 'bg-gray-100 text-gray-800';
      case 'enum': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{field.name}</CardTitle>
            <CardDescription>{field.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {field.required ? (
              <CheckCircle className="w-4 h-4 text-green-600" title="Required field" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-500" title="Optional field" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Reference:</span>
            <code className="px-2 py-1 bg-gray-100 rounded text-sm">{field.reference}</code>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="font-medium text-sm">Type:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDataTypeColor(field.dataType)}`}>
              {field.dataType}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Required:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              field.required 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {field.required ? 'Yes' : 'No'}
            </span>
          </div>
          
          {field.validation && field.validation.length > 0 && (
            <div>
              <span className="font-medium text-sm">Validation:</span>
              <ul className="mt-1 text-xs text-slate-700 space-y-1">
                {field.validation.map((rule, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-slate-500">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {field.notes && (
            <div>
              <span className="font-medium text-sm">Notes:</span>
              <p className="mt-1 text-sm text-slate-700">{field.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}