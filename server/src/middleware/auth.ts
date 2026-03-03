import { FastifyRequest, FastifyReply } from 'fastify';
import { createClient } from '@supabase/supabase-js';

// Server-side: use SUPABASE_URL and SUPABASE_ANON_KEY (without VITE_ prefix)
// VITE_ prefix is only for client-side code that gets bundled by Vite
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client for server-side JWT verification
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface AuthenticatedRequest extends FastifyRequest {
  userId?: string;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

/**
 * Middleware to verify JWT token from Supabase
 * Expects Authorization header: "Bearer <token>"
 */
export async function authenticateUser(
  request: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401).send({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      reply.code(401).send({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user to request
    request.userId = user.id;
    request.user = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'user'
    };
  } catch (error) {
    reply.code(401).send({ error: 'Authentication failed' });
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(allowedRoles: string[]) {
  return async (request: AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.code(401).send({ error: 'Authentication required' });
      return;
    }

    const userRole = request.user.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      reply.code(403).send({ error: 'Insufficient permissions' });
      return;
    }
  };
}

