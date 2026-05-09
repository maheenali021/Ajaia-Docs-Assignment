import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST /api/documents/[id]/upload - Upload .txt or .md file
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    // Get the document
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        shares: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check write access
    const hasAccess =
      document.ownerId === user.id ||
      document.shares.some((share) => share.userId === user.id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.txt') && !fileName.endsWith('.md')) {
      return NextResponse.json({ error: 'Only .txt and .md files are supported' }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Read file content
    const text = await file.text();

    // Convert plain text to TipTap JSON format
    // Split by lines and create paragraphs
    const lines = text.split('\n');
    const content = {
      type: 'doc',
      content: lines.map((line) => ({
        type: 'paragraph',
        content: line.trim() ? [{ type: 'text', text: line }] : [],
      })),
    };

    // Update document with new content
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
