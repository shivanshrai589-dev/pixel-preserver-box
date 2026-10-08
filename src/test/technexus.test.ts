import { describe, expect, it } from 'vitest';
import { recordSchema, submissionSchema } from '@/lib/club-schema';
import { createRouter, rootRouteId } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { routeTree } from '@/routeTree.gen';

describe('TechNexus routing and validation', () => {
  it.each(['/about','/activities','/members','/core-team','/events','/events/test','/join','/volunteer','/contact','/admin/login','/reset-password','/admin','/admin/events','/admin/members','/admin/settings','/admin/settings/admins'])('matches %s', path => {
    const router = createRouter({ routeTree, context: {queryClient: new QueryClient()} });
    expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it('rejects incomplete applications', () => {
    expect(submissionSchema.safeParse({kind:'join',data:{name:'Test',email:'not-an-email'}}).success).toBe(false);
    expect(submissionSchema.safeParse({kind:'volunteer',data:{name:'Test',email:'test@example.com'}}).success).toBe(false);
  });
  it('accepts contact without student information', () => {
    expect(submissionSchema.safeParse({kind:'contact',data:{name:'Test',email:'test@example.com',subject:'Hello',message:'A test message'}}).success).toBe(true);
  });
  it('rejects unknown administrator tables', () => {
    expect(recordSchema.safeParse({table:'user_roles',data:{},status:'Active'}).success).toBe(false);
  });
});