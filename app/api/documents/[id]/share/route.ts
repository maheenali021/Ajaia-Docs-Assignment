import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendShareNotification } from '@/lib/email';

// POST /api/documents/[id]/share - Share document with user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Get the document
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Only owner can share
    if (document.ownerId !== user.id) {
      return NextResponse.json({ error: 'Only the owner can share this document' }, { status: 403 });
    }

    // Cannot share with yourself
    if (normalizedEmail === user.email.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot share document with yourself' }, { status: 400 });
    }

    // Find or create user
    let shareWithUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!shareWithUser) {
      // Auto-create user account for the email
      // Generate a name from email (e.g., "john.doe@example.com" → "John Doe")
      const emailUsername = normalizedEmail.split('@')[0];
      const nameParts = emailUsername.split(/[._-]/).map((part: string) =>
        part.charAt(0).toUpperCase() + part.slice(1)
      );
      const generatedName = nameParts.join(' ');

      shareWithUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: generatedName,
        },
      });
    }

    // Create share (upsert to handle duplicates)
    const share = await prisma.share.upsert({
      where: {
        documentId_userId: {
          documentId: id,
          userId: shareWithUser.id,
        },
      },
      update: {},
      create: {
        documentId: id,
        userId: shareWithUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send email notification
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await sendShareNotification({
      recipientEmail: shareWithUser.email,
      recipientName: shareWithUser.name,
      documentTitle: document.title,
      documentId: document.id,
      sharedByName: user.name,
      appUrl,
    });

    return NextResponse.json(share, { status: 201 });
  } catch (error) {
    console.error('Error sharing document:', error);
    return NextResponse.json({ error: 'Failed to share document' }, { status: 500 });
  }
}

// DELETE /api/documents/[id]/share - Revoke share access
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get the document
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Only owner can revoke shares
    if (document.ownerId !== user.id) {
      return NextResponse.json({ error: 'Only the owner can revoke share access' }, { status: 403 });
    }

    await prisma.share.delete({
      where: {
        documentId_userId: {
          documentId: id,
          userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking share:', error);
    return NextResponse.json({ error: 'Failed to revoke share' }, { status: 500 });
  }
}
