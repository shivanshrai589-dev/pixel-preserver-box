import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: unknown; userId: string }) {
  const sb = context.supabase as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }>;
  };
  const { data } = await sb.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Administrator access required");
}

export type AdminEntry = {
  userId: string;
  email: string;
  name: string;
  addedAt: string;
  isSelf: boolean;
};

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminEntry[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "admin")
      .order("created_at");
    if (error) throw new Error("Unable to load administrators");
    return Promise.all(
      (roles ?? []).map(async (r) => {
        const { data } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
        const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>;
        const name = String(meta["full_name"] ?? meta["name"] ?? "");
        return {
          userId: r.user_id,
          email: data.user?.email ?? "Unknown account",
          name,
          addedAt: r.created_at,
          isSelf: r.user_id === context.userId,
        };
      }),
    );
  });

export const addAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) =>
    z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email").max(255) }).parse(v),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let found: string | null = null;
    for (let page = 1; page <= 50 && !found; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error("Unable to look up accounts");
      found = list.users.find((u) => u.email?.toLowerCase() === data.email)?.id ?? null;
      if (list.users.length < 200) break;
    }
    if (!found)
      throw new Error("This person must create an account first before they can be made an admin.");
    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", found)
      .eq("role", "admin")
      .maybeSingle();
    if (existing) throw new Error("This person is already an administrator.");
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: found, role: "admin" });
    if (error) throw new Error("Unable to grant administrator access");
    return { ok: true };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ userId: z.string().uuid() }).parse(v))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.userId === context.userId)
      throw new Error("You can't remove your own administrator access. Ask another admin to do it.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) <= 1) throw new Error("The last remaining administrator can't be removed.");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error("Unable to remove administrator access");
    return { ok: true };
  });
