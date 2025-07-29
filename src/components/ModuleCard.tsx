import React from 'react';
import Link from 'next/link';
import { PlanningModule } from '@/types/planning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageSquare, Settings } from 'lucide-react';

interface ModuleCardProps {
  module: PlanningModule;
  showDetails?: boolean;
}

export function ModuleCard({ module, showDetails = false }: ModuleCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link 
            href={`/modules/${module.reference}`}
            className="hover:text-blue-600 transition-colors"
          >
            {module.name}
          </Link>
        </CardTitle>
        <CardDescription>
          {module.description}
        </CardDescription>
      </CardHeader>
      
      {showDetails && (
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Reference:</span> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">{module.reference}</code>
            </div>
            
            {module.discussionNumber && (
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">Discussion:</span>
                <span className="text-gray-600">{module.discussionNumber}</span>
              </div>
            )}
            
            {module.notes && (
              <div>
                <span className="font-medium">Notes:</span> 
                <span className="ml-2 text-gray-600">{module.notes}</span>
              </div>
            )}
            
            {module.replacedBy && (
              <div className="text-orange-600">
                <span className="font-medium">Replaced by:</span> 
                <Link 
                  href={`/modules/${module.replacedBy}`}
                  className="ml-2 underline hover:text-orange-800"
                >
                  {module.replacedBy}
                </Link>
              </div>
            )}
            
            {module.endDate && (
              <div className="text-red-600">
                <span className="font-medium">Deprecated:</span> 
                <span className="ml-2">{module.endDate}</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <div className="px-6 pb-4">
        <Link 
          href={`/modules/${module.reference}`}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          View module details
        </Link>
      </div>
    </Card>
  );
}