import React from 'react';
import Link from 'next/link';
import { ApplicationType } from '@/types/planning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ExternalLink, FileText } from 'lucide-react';

interface ApplicationCardProps {
  application: ApplicationType;
  showDetails?: boolean;
}

export function ApplicationCard({ application, showDetails = false }: ApplicationCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link 
            href={`/applications/${application.reference}`}
            className="hover:text-blue-600 transition-colors"
          >
            {application.name}
          </Link>
        </CardTitle>
        <CardDescription>
          {application.description}
        </CardDescription>
      </CardHeader>
      
      {showDetails && (
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Reference:</span> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">{application.reference}</code>
            </div>
            
            {application.synonyms && (
              <div>
                <span className="font-medium">Also known as:</span> 
                <span className="ml-2 text-gray-800">{application.synonyms}</span>
              </div>
            )}
            
            {application.legislation && (
              <div className="flex items-start gap-2">
                <span className="font-medium">Legislation:</span>
                <div className="flex-1">
                  {application.legislation.split(';').map((link, index) => (
                    <div key={index} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                      <ExternalLink className="w-3 h-3" />
                      <a 
                        href={link.trim()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs underline"
                      >
                        Link {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {application.notes && (
              <div>
                <span className="font-medium">Notes:</span> 
                <span className="ml-2 text-gray-800">{application.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <div className="px-6 pb-4">
        <Link 
          href={`/applications/${application.reference}`}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          View specification
        </Link>
      </div>
    </Card>
  );
}