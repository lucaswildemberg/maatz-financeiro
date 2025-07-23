import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'auth-session';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password);
  
  try {
    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    }).returning();
    
    return { success: true, user };
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return { success: false, error: 'Email already exists' };
    }
    throw error;
  }
}

export async function login(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const isValidPassword = await verifyPassword(password, user.password);
  
  if (!isValidPassword) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  
  return { success: true, user };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!userId) {
    return null;
  }
  
  const [user] = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, parseInt(userId)));
  
  return user || null;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}