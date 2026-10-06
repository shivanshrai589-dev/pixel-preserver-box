import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  LogOut,
  LayoutDashboard,
  Users,
  CalendarDays,
  Code2,
  Mail,
  FileText,
  Settings,
  HeartHandshake,
  LoaderCircle,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getAdminClub, saveRecord, deleteRecord } from "@/lib/club.functions";
import { fields, label, type Table, type RecordRow } from "@/lib/club-schema";
const sections = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/members", "Members", Users],
  ["/admin/core-team", "Core team", Users],
  ["/admin/activities", "Activities", Code2],
  ["/admin/events", "Events", CalendarDays],
  ["/admin/volunteers", "Volunteers", HeartHandshake],
  ["/admin/join-applications", "Join applications", FileText],
  ["/admin/contact-messages", "Messages", Mail],
  ["/admin/content", "Content", FileText],
  ["/admin/settings", "Settings", Settings],
] as const;
export function Admin({ table }: { table?: Table }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["admin-club"],
    queryFn: () => getAdminClub(),
    retry: false,
  });
  const [editing, setEditing] = useState<{
    id?: string;
    data: Record<string, string>;
    status: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const inbox = table?.endsWith("applications") || table === "contact_messages";
  const content = table === "club_content" || table === "site_settings";
  const rows = table
    ? (data?.[table] ?? []).filter((r) =>
        JSON.stringify(r.data).toLowerCase().replace(/\s+/g, " ").includes(search.toLowerCase().replace(/\s+/g, " ").trim()),
      )
    : [];
  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin-club"] });
    await qc.invalidateQueries({ queryKey: ["public-club"] });
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!table || !editing) return;
    setBusy(true);
    setNotice("");
    try {
      const clean = { ...editing.data };
      delete clean["placeholder"];
      await saveRecord({
        data: { table, ...editing, data: clean, status: editing.status as "Active" },
      });
      setEditing(null);
      await refresh();
      setNotice("Saved successfully.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Unable to save");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (!table) return;
    setBusy(true);
    try {
      await deleteRecord({ data: { table, id } });
      setConfirmDelete(null);
      await refresh();
      setNotice("Record deleted.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Unable to delete");
    } finally {
      setBusy(false);
    }
  }
  async function review(r: RecordRow) {
    if (!table) return;
    try {
      await saveRecord({
        data: {
          table,
          id: r.id,
          data: r.data,
          status: table === "contact_messages" ? "Read" : "Reviewed",
        },
      });
      await refresh();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Unable to update");
    }
  }
  async function upload(file: File) {
    if (!editing) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setNotice("Choose a PNG, JPG, or WebP image under 5 MB.");
      return;
    }
    setBusy(true);
    const path = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
    const { error } = await supabase.storage
      .from("club-images")
      .upload(path, file, { contentType: file.type });
    if (error) setNotice("Unable to upload this image.");
    else setEditing({ ...editing, data: { ...editing.data, image: `club-images/${path}` } });
    setBusy(false);
  }
  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login", replace: true });
  }
  return (
    <div className="admin-shell">
      <nav className="admin-sidebar" aria-label="Administrator navigation">
        {sections.map(([to, name, Icon]) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}>
            <Icon className="size-4" />
            {name}
          </Link>
        ))}
      </nav>
      <main className="admin-content">
        <div className="admin-header">
          <h1>
            {table ? label(table === "club_content" ? "website_content" : table) : "Club overview"}
          </h1>
          <div className="flex gap-2">
            {table && !inbox && !content && (
              <Button
                onClick={() =>
                  setEditing({ data: {}, status: table === "events" ? "Upcoming" : "Active" })
                }
              >
                <Plus />
                Add new
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              title="Sign out"
              aria-label="Sign out"
              onClick={logout}
            >
              <LogOut />
            </Button>
          </div>
        </div>
        {notice && (
          <div className="form-notice" role="status">
            {notice}
          </div>
        )}
        {isPending ? (
          <LoaderCircle className="spin" />
        ) : error ? (
          <div className="empty">
            <h2>Administrator access is required.</h2>
            <p>If this is your first visit, your account needs administrator approval.</p>
            <Button className="mt-4" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : !table ? (
          <div className="admin-metrics">
            {Object.entries(data ?? {})
              .filter(([k]) => !["club_content", "site_settings"].includes(k))
              .map(([k, items]) => (
                <div className="admin-metric" key={k}>
                  <span className="text-muted-foreground text-xs">{label(k)}</span>
                  <strong>
                    {k === "core_members"
                      ? items.filter((r) => r.data["placeholder"] !== "true").length
                      : items.length}
                  </strong>
                </div>
              ))}
          </div>
        ) : (
          <>
            {editing && (
              <form className="editor" onSubmit={save}>
                <div className="admin-header">
                  <h2 className="text-xl">{editing.id ? "Edit record" : "New record"}</h2>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close editor"
                    onClick={() => setEditing(null)}
                  >
                    <X />
                  </Button>
                </div>
                <div className="form-grid">
                  {fields[table]
                    .filter((k) => k !== "image" && k !== "show_email")
                    .map((key) => (
                      <div
                        className={`field ${["description", "bio", "hero_description", "about", "mission", "vision", "objectives", "footer"].includes(key) ? "field-wide" : ""}`}
                        key={key}
                      >
                        <label htmlFor={`edit-${key}`}>{label(key)}</label>
                        {[
                          "description",
                          "bio",
                          "hero_description",
                          "about",
                          "mission",
                          "vision",
                          "objectives",
                          "footer",
                          "cta",
                        ].includes(key) ? (
                          <textarea
                            id={`edit-${key}`}
                            rows={3}
                            className="field-input"
                            value={editing.data[key] ?? ""}
                            maxLength={3000}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                data: { ...editing.data, [key]: e.target.value },
                              })
                            }
                          />
                        ) : (
                          <input
                            id={`edit-${key}`}
                            type={
                              key === "date"
                                ? "date"
                                : key.endsWith("time")
                                  ? "time"
                                  : key === "email"
                                    ? "email"
                                    : "text"
                            }
                            className="field-input"
                            maxLength={1000}
                            value={editing.data[key] ?? ""}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                data: { ...editing.data, [key]: e.target.value },
                              })
                            }
                          />
                        )}
                      </div>
                    ))}
                  {table === "members" && (
                    <label className="flex gap-2 items-center text-xs">
                      <input
                        type="checkbox"
                        checked={editing.data["show_email"] === "true"}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            data: { ...editing.data, show_email: String(e.target.checked) },
                          })
                        }
                      />
                      Show email publicly
                    </label>
                  )}
                  {fields[table].includes("image") && (
                    <div className="field">
                      <label htmlFor="upload-image">Profile / cover image (up to 5 MB)</label>
                      <input
                        id="upload-image"
                        className="field-input"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={busy}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void upload(file);
                        }}
                      />
                      {editing.data["image"] && (
                        <span className="text-xs text-muted-foreground flex gap-2">
                          <Upload className="size-3" />
                          Image uploaded
                        </span>
                      )}
                    </div>
                  )}
                  {!content && (
                    <div className="field">
                      <label htmlFor="edit-status">Status</label>
                      <select
                        id="edit-status"
                        className="field-input"
                        value={editing.status}
                        onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                      >
                        {(table === "events"
                          ? ["Upcoming", "Ongoing", "Completed", "Cancelled", "Draft"]
                          : table === "activities"
                            ? ["Active", "Draft"]
                            : ["Active", "Inactive"]
                        ).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="editor-actions">
                  <Button disabled={busy} type="submit">
                    {busy ? <LoaderCircle className="spin" /> : <Check />}Save changes
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            {!content && (
              <input
                className="field-input mb-5"
                aria-label="Search records"
                placeholder="Search records…"
                maxLength={100}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
            <div className="admin-list">
              {rows.map((r) => (
                <article key={r.id} className="admin-row">
                  <div className="min-w-0">
                    <h3>
                      {r.data["name"] ??
                        r.data["title"] ??
                        (content
                          ? table === "club_content"
                            ? "Website copy"
                            : "Public website settings"
                          : "Submission")}
                    </h3>
                    <p>
                      {r.data["email"] ?? r.data["position"] ?? r.data["category"] ?? ""}
                      {!content && ` · ${r.status}`}
                    </p>
                    {inbox && (
                      <details className="mt-3">
                        <summary className="text-xs cursor-pointer">View submission</summary>
                        <dl className="mt-4 space-y-3">
                          {Object.entries(r.data)
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <div key={k}>
                                <dt className="text-xs font-semibold">{label(k)}</dt>
                                <dd className="text-xs whitespace-pre-wrap break-words mt-1 text-muted-foreground">
                                  {v}
                                </dd>
                              </div>
                            ))}
                        </dl>
                      </details>
                    )}
                  </div>
                  <div className="row-actions">
                    {inbox ? (
                      <Button
                        variant="outline"
                        size="icon"
                        title="Mark reviewed"
                        aria-label="Mark reviewed"
                        onClick={() => review(r)}
                      >
                        <Check />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        title="Edit record"
                        aria-label="Edit record"
                        onClick={() => setEditing({ id: r.id, data: r.data, status: r.status })}
                      >
                        <Pencil />
                      </Button>
                    )}
                    {!content && (
                      <Button
                        variant="outline"
                        size="icon"
                        title="Delete record"
                        aria-label="Delete record"
                        onClick={() => setConfirmDelete(r.id)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                    {confirmDelete === r.id && (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={busy}
                          onClick={() => remove(r.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Cancel deletion"
                          onClick={() => setConfirmDelete(null)}
                        >
                          <X />
                        </Button>
                      </>
                    )}
                  </div>
                </article>
              ))}
              {!rows.length && (
                <div className="empty">
                  <h3>No records yet.</h3>
                  <p>
                    {inbox ? "New submissions will appear here." : "Add a record to get started."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
