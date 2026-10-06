import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { tables, recordSchema, submissionSchema, type RecordRow } from "./club-schema";
import type { Database } from "@/integrations/supabase/types";

export const getPublicClub = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Club content is temporarily unavailable");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const names = [
    "members",
    "core_members",
    "activities",
    "events",
    "club_content",
    "site_settings",
  ] as const;
  const result: Record<string, RecordRow[]> = {};
  await Promise.all(
    names.map(async (table) => {
      const { data, error } = table === 'members'
        ? await client.from('public_members').select('*').order('created_at')
        : await client.from(table).select('*').order('created_at');
      if (error) throw new Error("Unable to load club content. Please try again.");
      result[table] = await Promise.all(
        ((data ?? []) as unknown as RecordRow[]).map(async (r) => {
          const d = r.data as Record<string, string>;
          const safe = { ...d };
          if (table === "members" && safe["show_email"] !== "true") delete safe["email"];
          if (safe["image"]?.startsWith("club-images/")) {
            const { data: signed } = await client.storage
              .from("club-images")
              .createSignedUrl(safe["image"].slice(12), 3600);
            safe["image"] = signed?.signedUrl ?? "";
          }
          return { id: r.id ?? '', status: r.status ?? 'Active', created_at: r.created_at ?? '', data: safe };
        }),
      );
    }),
  );
  return result;
});
export const getAdminClub = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!allowed) throw new Error("Administrator access required");
    const result: Record<string, RecordRow[]> = {};
    await Promise.all(
      tables.map(async (table) => {
        const { data, error } = await context.supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw new Error("Unable to load administrator records");
        result[table] = (data ?? []) as RecordRow[];
      }),
    );
    return result;
  });
export const saveRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => recordSchema.parse(v))
  .handler(async ({ context, data }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!allowed) throw new Error("Administrator access required");
    for (const [key, value] of Object.entries(data.data)) {
      if (
        ["linkedin", "github", "instagram", "link", "registration_url", "canonical_url"].includes(
          key,
        ) &&
        value &&
        !/^https:\/\//.test(value)
      )
        throw new Error("Links must start with https://");
      if (key === "image" && value && !value.startsWith("club-images/"))
        throw new Error("Please upload an image");
    }
    const isContent = ["club_content", "site_settings"].includes(data.table);
    const isInbox = data.table.endsWith("applications") || data.table === "contact_messages";
    if (!isContent && !isInbox && !data.data["name"] && !data.data["title"])
      throw new Error("A name or title is required");
    const payload = { data: data.data, status: data.status };
    const q = data.id
      ? context.supabase.from(data.table).update(payload).eq("id", data.id)
      : context.supabase.from(data.table).insert(payload);
    const { error } = await q;
    if (error) throw new Error("Unable to save this record");
    return { ok: true };
  });
export const deleteRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => z.object({ table: z.enum(tables), id: z.string().uuid() }).parse(v))
  .handler(async ({ context, data }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!allowed) throw new Error("Administrator access required");
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error("Unable to delete record");
    return { ok: true };
  });
export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((v) => submissionSchema.parse(v))
  .handler(async ({ data }) => {
    if (data.data["website"]) throw new Error("Unable to submit this form");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const request = getRequest();
    const ip = request.headers.get("cf-connecting-ip") ?? "local";
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
    const hash = Array.from(new Uint8Array(bytes))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
    const { data: allowed, error: limitError } = await supabaseAdmin.rpc(
      "consume_submission_limit",
      { input_key: `${data.kind}:${hash}` },
    );
    if (limitError || !allowed)
      throw new Error("Too many submissions. Please try again in an hour.");
    const table =
      data.kind === "join"
        ? "join_applications"
        : data.kind === "volunteer"
          ? "volunteer_applications"
          : "contact_messages";
    const { website, ...safe } = data.data;
    const { error } = await supabaseAdmin
      .from(table)
      .insert({ data: safe, email: safe["email"].toLowerCase() });
    if (error) {
      if (error.code === "23505")
        throw new Error("An application with this email has already been received.");
      throw new Error("Unable to send your submission. Please try again.");
    }
    return { ok: true };
  });
