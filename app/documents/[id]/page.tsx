'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { Editor } from '@/components/editor';
import { ShareDialog } from '@/components/share-dialog';
import { UploadDialog } from '@/components/upload-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Document {
  id: string;
  title: string;
  content: any;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  shares: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [title, setTitle] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  async function fetchDocument() {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
        setTitle(data.title);
      } else if (response.status === 404) {
        setError('Document not found');
      } else if (response.status === 403) {
        setError('You do not have access to this document');
      } else {
        setError('Failed to load document');
      }
    } catch (err) {
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  }

  const saveDocument = useCallback(
    async (updates: { title?: string; content?: any }) => {
      setSaving(true);
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.error('Error saving document:', err);
      } finally {
        setSaving(false);
      }
    },
    [documentId]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      if (newTitle.trim() && newTitle !== document?.title) {
        saveDocument({ title: newTitle });
      }
    }, 1000);

    setSaveTimeout(timeout);
  };

  const handleContentChange = (content: any) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      saveDocument({ content });
    }, 1000);

    setSaveTimeout(timeout);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Failed to delete document');
      }
    } catch (err) {
      alert('Failed to delete document');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">{error || 'Document not found'}</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const isOwner = document.ownerId === document.owner.id;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-2"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
          <UploadDialog documentId={documentId} onUploadComplete={fetchDocument} />
          <ShareDialog
            documentId={documentId}
            isOwner={isOwner}
            shares={document.shares}
            onShareUpdate={fetchDocument}
          />
          {isOwner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor content={document.content} onChange={handleContentChange} />
      </div>
    </div>
  );
}
