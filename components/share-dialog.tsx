'use client';

import { useState } from 'react';
import { Share2, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ShareUser {
  id: string;
  name: string;
  email: string;
}

interface ShareDialogProps {
  documentId: string;
  isOwner: boolean;
  shares: Array<{
    id: string;
    user: ShareUser;
  }>;
  onShareUpdate: () => void;
}

export function ShareDialog({ documentId, isOwner, shares, onShareUpdate }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sharing, setSharing] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleShare(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setSharing(true);
    setError('');

    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (response.ok) {
        setEmail('');
        onShareUpdate();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to share document');
      }
    } catch (err) {
      setError('Failed to share document');
    } finally {
      setSharing(false);
    }
  }

  async function handleRevoke(userId: string) {
    setRevoking(userId);
    setError('');

    try {
      const response = await fetch(`/api/documents/${documentId}/share?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onShareUpdate();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to revoke access');
      }
    } catch (err) {
      setError('Failed to revoke access');
    } finally {
      setRevoking(null);
    }
  }

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Enter an email address to share this document. The recipient can access it by visiting the app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleShare} className="flex gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sharing}
              className="flex-1"
            />
            <Button type="submit" disabled={!email || sharing}>
              {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share'}
            </Button>
          </form>

          {shares.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Shared with:</h3>
              <div className="space-y-2">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div>
                      <p className="text-sm font-medium">{share.user.name}</p>
                      <p className="text-xs text-muted-foreground">{share.user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevoke(share.user.id)}
                      disabled={revoking === share.user.id}
                    >
                      {revoking === share.user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
