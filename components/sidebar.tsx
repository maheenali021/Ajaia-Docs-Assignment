'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  ownerId: string;
  owner?: {
    name: string;
    email: string;
  };
}

interface DocumentsData {
  owned: Document[];
  shared: Document[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [documents, setDocuments] = useState<DocumentsData>({ owned: [], shared: [] });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createDocument() {
    setCreating(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Document' }),
      });

      if (response.ok) {
        const newDoc = await response.json();
        setDocuments((prev) => ({
          ...prev,
          owned: [newDoc, ...prev.owned],
        }));
        window.location.href = `/documents/${newDoc.id}`;
      }
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="w-64 border-r bg-muted/10 flex flex-col h-screen">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Docs Editor</h1>
      </div>

      <div className="p-4">
        <Button
          onClick={createDocument}
          disabled={creating}
          className="w-full"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Document
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="px-4 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                My Documents
              </h2>
              {documents.owned.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No documents yet</p>
              ) : (
                <div className="space-y-1">
                  {documents.owned.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors',
                        pathname === `/documents/${doc.id}` && 'bg-accent'
                      )}
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 mt-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                Shared with Me
              </h2>
              {documents.shared.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No shared documents</p>
              ) : (
                <div className="space-y-1">
                  {documents.shared.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors',
                        pathname === `/documents/${doc.id}` && 'bg-accent'
                      )}
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          by {doc.owner?.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
