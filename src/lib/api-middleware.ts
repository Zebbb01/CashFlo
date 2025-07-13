// src/lib/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type AuthenticatedRequest = NextRequest & {
  user: { id: string; email: string; name?: string };
};

export type APIContext = {
  params: Record<string, string>;
};

// Modified: Allow APIHandler to return an error response type as well
export type APIHandler<T = any> = (
  req: AuthenticatedRequest,
  context: APIContext
) => Promise<NextResponse<T> | NextResponse<{ error: string }>>; // Added error response type

// Authentication middleware
export function withAuth<T>(handler: APIHandler<T>) {
  return async (req: NextRequest, context: APIContext) => {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = session.user as any;

      // The handler can now correctly return either type
      return await handler(authenticatedReq, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// Error handling wrapper
export function withErrorHandling<T>(handler: APIHandler<T>) {
  return async (req: AuthenticatedRequest, context: APIContext) => {
    try {
      // The handler can now correctly return either type
      return await handler(req, context);
    } catch (error: any) {
      console.error('API Error:', error);

      // Handle Prisma errors
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Unique constraint violation' }, { status: 409 });
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// Combine middleware - no changes needed here, as it uses the updated APIHandler
export function withMiddleware<T>(handler: APIHandler<T>) {
  return withAuth(withErrorHandling(handler));
}