import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const maheen = await prisma.user.upsert({
    where: { email: 'maheen@example.com' },
    update: {},
    create: {
      email: 'maheen@example.com',
      name: 'Maheen',
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@example.com' },
    update: {},
    create: {
      email: 'reviewer@example.com',
      name: 'Reviewer',
    },
  });

  // Create sample documents for Maheen
  const doc1 = await prisma.document.upsert({
    where: { id: 'sample-doc-1' },
    update: {},
    create: {
      id: 'sample-doc-1',
      title: 'Welcome Document',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Welcome to the Collaborative Editor' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is a sample document. You can ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
              { type: 'text', text: ', ' },
              { type: 'text', marks: [{ type: 'italic' }], text: 'italicize' },
              { type: 'text', text: ', and ' },
              { type: 'text', marks: [{ type: 'underline' }], text: 'underline' },
              { type: 'text', text: ' text.' },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Create new documents' }] }],
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Share with other users' }] }],
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Upload .txt or .md files' }] }],
              },
            ],
          },
        ],
      },
      ownerId: maheen.id,
    },
  });

  const doc2 = await prisma.document.upsert({
    where: { id: 'sample-doc-2' },
    update: {},
    create: {
      id: 'sample-doc-2',
      title: 'My Notes',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start writing your notes here...' }],
          },
        ],
      },
      ownerId: maheen.id,
    },
  });

  // Share doc1 with reviewer
  await prisma.share.upsert({
    where: {
      documentId_userId: {
        documentId: doc1.id,
        userId: reviewer.id,
      },
    },
    update: {},
    create: {
      documentId: doc1.id,
      userId: reviewer.id,
    },
  });

  console.log('✅ Database seeded successfully');
  console.log('Users created:', { maheen: maheen.email, reviewer: reviewer.email });
  console.log('Documents created:', { doc1: doc1.title, doc2: doc2.title });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
