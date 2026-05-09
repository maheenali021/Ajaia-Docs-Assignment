/**
 * Document API Routes Test
 *
 * Tests document CRUD operations, access control, and sharing functionality.
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/documents/route';
import { GET as getDocument, PATCH, DELETE } from '@/app/api/documents/[id]/route';
import { POST as shareDocument } from '@/app/api/documents/[id]/share/route';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    share: {
      upsert: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock auth
jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(() =>
    Promise.resolve({
      id: 'user-1',
      email: 'maheen@example.com',
      name: 'Maheen',
    })
  ),
}));

import { prisma } from '@/lib/prisma';

describe('Document API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/documents - Create Document', () => {
    it('should create a new document', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        content: { type: 'doc', content: [] },
        ownerId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.document.create as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Document' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe('Test Document');
      expect(prisma.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Test Document',
          ownerId: 'user-1',
        }),
      });
    });

    it('should reject empty title', async () => {
      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: JSON.stringify({ title: '' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title is required');
    });

    it('should reject title over 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: JSON.stringify({ title: longTitle }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title must be 200 characters or less');
    });
  });

  describe('GET /api/documents/[id] - Access Control', () => {
    it('should allow owner to access document', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        content: { type: 'doc', content: [] },
        ownerId: 'user-1',
        owner: { id: 'user-1', name: 'Maheen', email: 'maheen@example.com' },
        shares: [],
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1');
      const response = await getDocument(request, { params: Promise.resolve({ id: 'doc-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('doc-1');
    });

    it('should allow shared user to access document', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        content: { type: 'doc', content: [] },
        ownerId: 'user-2',
        owner: { id: 'user-2', name: 'Other User', email: 'other@example.com' },
        shares: [
          {
            userId: 'user-1',
            user: { id: 'user-1', name: 'Maheen', email: 'maheen@example.com' },
          },
        ],
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1');
      const response = await getDocument(request, { params: Promise.resolve({ id: 'doc-1' }) });

      expect(response.status).toBe(200);
    });

    it('should deny access to non-owner without share', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        content: { type: 'doc', content: [] },
        ownerId: 'user-2',
        owner: { id: 'user-2', name: 'Other User', email: 'other@example.com' },
        shares: [],
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1');
      const response = await getDocument(request, { params: Promise.resolve({ id: 'doc-1' }) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied');
    });

    it('should return 404 for non-existent document', async () => {
      (prisma.document.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-999');
      const response = await getDocument(request, { params: Promise.resolve({ id: 'doc-999' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Document not found');
    });
  });

  describe('POST /api/documents/[id]/share - Sharing', () => {
    it('should allow owner to share document', async () => {
      const mockDocument = {
        id: 'doc-1',
        ownerId: 'user-1',
      };

      const mockShareUser = {
        id: 'user-2',
        email: 'reviewer@example.com',
        name: 'Reviewer',
      };

      const mockShare = {
        id: 'share-1',
        documentId: 'doc-1',
        userId: 'user-2',
        user: mockShareUser,
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockShareUser);
      (prisma.share.upsert as jest.Mock).mockResolvedValue(mockShare);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1/share', {
        method: 'POST',
        body: JSON.stringify({ email: 'reviewer@example.com' }),
      });

      const response = await shareDocument(request, { params: Promise.resolve({ id: 'doc-1' }) });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user.email).toBe('reviewer@example.com');
    });

    it('should prevent non-owner from sharing', async () => {
      const mockDocument = {
        id: 'doc-1',
        ownerId: 'user-2', // Different from current user
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1/share', {
        method: 'POST',
        body: JSON.stringify({ email: 'reviewer@example.com' }),
      });

      const response = await shareDocument(request, { params: Promise.resolve({ id: 'doc-1' }) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Only the owner can share this document');
    });
  });

  describe('DELETE /api/documents/[id] - Delete Document', () => {
    it('should allow owner to delete document', async () => {
      const mockDocument = {
        id: 'doc-1',
        ownerId: 'user-1',
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);
      (prisma.document.delete as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1');
      const response = await DELETE(request, { params: Promise.resolve({ id: 'doc-1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.document.delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } });
    });

    it('should prevent non-owner from deleting', async () => {
      const mockDocument = {
        id: 'doc-1',
        ownerId: 'user-2', // Different from current user
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);

      const request = new NextRequest('http://localhost:3000/api/documents/doc-1');
      const response = await DELETE(request, { params: Promise.resolve({ id: 'doc-1' }) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Only the owner can delete this document');
    });
  });
});
