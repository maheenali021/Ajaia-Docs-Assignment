import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('mock-user')?.value || 'maheen@example.com';

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function setCurrentUser(email: string) {
  const cookieStore = await cookies();
  cookieStore.set('mock-user', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
