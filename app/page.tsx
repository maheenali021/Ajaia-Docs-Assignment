import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { FileText } from 'lucide-react';

export default async function Home() {
  const user = await getCurrentUser();

  // Try to redirect to the first owned document
  const firstDocument = await prisma.document.findFirst({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
  });

  if (firstDocument) {
    redirect(`/documents/${firstDocument.id}`);
  }

  // Show empty state if no documents
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Welcome to Docs Editor</h1>
        <p className="text-muted-foreground max-w-md">
          Create your first document to get started. Click the "New Document" button in the sidebar.
        </p>
      </div>
    </div>
  );
}
