import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LoaderCircle, Plus, ShieldCheck, UserMinus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminFrame } from "@/components/technexus/admin";
import { listAdmins, addAdmin, removeAdmin, type AdminEntry } from "@/lib/admins.functions";

export function AdminManagement() {
  const qc = useQueryClient();
  const list = useServerFn(listAdmins);
  const add = useServerFn(addAdmin);
  const remove = useServerFn(removeAdmin);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["admin-list"],
    queryFn: () => list(),
    retry: false,
  });
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<AdminEntry | null>(null);
  const admins = data ?? [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError("Enter a valid email address.");
      return;
    }
    setFieldError("");
    setBusy(true);
    try {
      await add({ data: { email: value } });
      toast.success("Administrator access granted.");
      setEmail("");
      setOpen(false);
      await qc.invalidateQueries({ queryKey: ["admin-list"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to add administrator");
    } finally {
      setBusy(false);
    }
  }

  function askRemove(a: AdminEntry) {
    if (a.isSelf) {
      toast.error("You can't remove your own administrator access. Ask another admin to do it.");
      return;
    }
    if (admins.length <= 1) {
      toast.error("The last remaining administrator can't be removed.");
      return;
    }
    setTarget(a);
  }

  async function confirmRemove() {
    if (!target) return;
    setBusy(true);
    try {
      await remove({ data: { userId: target.userId } });
      toast.success("Administrator access removed.");
      await qc.invalidateQueries({ queryKey: ["admin-list"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to remove administrator");
    } finally {
      setBusy(false);
      setTarget(null);
    }
  }

  return (
    <AdminFrame
      title="Admin management"
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Add Admin
        </Button>
      }
    >
      {open && (
        <form className="editor" onSubmit={submit} noValidate>
          <div className="admin-header">
            <h2 className="text-xl">Add an administrator</h2>
            <Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>
          <div className="field">
            <label htmlFor="admin-email">Account email</label>
            <input
              id="admin-email"
              type="email"
              className="field-input"
              maxLength={255}
              value={email}
              aria-invalid={!!fieldError}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            {fieldError && <span className="field-error">{fieldError}</span>}
            <span className="text-xs text-muted-foreground">
              The person must already have signed in to TechNexus once.
            </span>
          </div>
          <div className="editor-actions">
            <Button type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="spin" /> : <ShieldCheck />}
              Grant admin access
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
      {isPending ? (
        <LoaderCircle className="spin" />
      ) : error ? (
        <div className="empty">
          <h2>Unable to load administrators.</h2>
          <Button className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !admins.length ? (
        <div className="empty">
          <h3>No administrators found.</h3>
        </div>
      ) : (
        <div className="admin-list">
          {admins.map((a) => (
            <article key={a.userId} className="admin-row">
              <div className="min-w-0">
                <h3 className="break-words">
                  {a.name || a.email}
                  {a.isSelf && <span className="text-xs text-muted-foreground"> (you)</span>}
                </h3>
                <p className="break-words">
                  {a.name ? `${a.email} · ` : ""}Admin · Added{" "}
                  {new Date(a.addedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="row-actions">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={`Remove admin ${a.email}`}
                  onClick={() => askRemove(a)}
                >
                  <UserMinus />
                  Remove Admin
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <AlertDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove admin access from this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.email} will keep their account but lose access to the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} disabled={busy}>
              Remove admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminFrame>
  );
}
