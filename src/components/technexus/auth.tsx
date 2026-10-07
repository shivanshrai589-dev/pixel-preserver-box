import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LoaderCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [forgot, setForgot] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });

      if (isAdmin) {
        void navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");

    const validEmail = z
      .string()
      .email()
      .max(255)
      .safeParse(email).success;

    if (!validEmail || (!forgot && !password)) {
      setNotice("Enter a valid email and password.");
      return;
    }

    setBusy(true);

    try {
      if (forgot) {
        const { error } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

        if (error) throw error;

        setNotice(
          "If this account exists, a password reset link has been sent.",
        );
      } else {
        const { data: signedIn, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error || !signedIn.user) {
          throw new Error(
            "Unable to sign in. Check your email and password.",
          );
        }

        // IMPORTANT:
        // Login is allowed only if the account has the admin role.
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: signedIn.user.id,
          _role: "admin",
        });

        if (!isAdmin) {
          await supabase.auth.signOut();

          throw new Error(
            "This account is not an approved TechNexus administrator.",
          );
        }

        await navigate({ to: "/admin" });
      }
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "Unable to sign in.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setNotice("");

    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/admin/login`,
      });

      if (result.error) throw result.error;

      if (!result.redirected) {
        const { data: current } = await supabase.auth.getUser();

        if (!current.user) {
          throw new Error(
            "Unable to sign in. Please try again.",
          );
        }

        // IMPORTANT:
        // Google accounts also need the admin role.
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: current.user.id,
          _role: "admin",
        });

        if (!isAdmin) {
          await supabase.auth.signOut();

          throw new Error(
            "This account is not an approved TechNexus administrator.",
          );
        }

        await navigate({ to: "/admin" });
      }
    } catch {
      setNotice(
        "Unable to sign in with Google. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <div className="auth-panel">
        <div className="eyebrow mb-5">
          TECHNEXUS ADMINISTRATION
        </div>

        <h1>
          {forgot ? "Reset your password." : "Welcome back."}
        </h1>

        <p>
          {forgot
            ? "We’ll send a secure link to your administrator email."
            : "Sign in to manage your club’s community, content, and events."}
        </p>

        {notice && (
          <div role="status" className="form-notice">
            {notice}
          </div>
        )}

        <form className="auth-form" onSubmit={login}>
          <div className="field">
            <label htmlFor="admin-email">
              Email address
            </label>

            <input
              className="field-input"
              id="admin-email"
              type="email"
              autoComplete="username"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!forgot && (
            <div className="field">
              <label htmlFor="admin-password">
                Password
              </label>

              <input
                className="field-input"
                id="admin-password"
                type="password"
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" disabled={busy}>
            {busy ? (
              <LoaderCircle className="spin" />
            ) : (
              <ArrowRight />
            )}

            {forgot ? "Send reset link" : "Sign in"}
          </Button>

          <Button
            type="button"
            variant="link"
            onClick={() => {
              setForgot(!forgot);
              setNotice("");
            }}
          >
            {forgot
              ? "Back to sign in"
              : "Forgot your password?"}
          </Button>
        </form>

        {!forgot && (
          <>
            <div className="divider">or</div>

            <Button
              className="w-full"
              variant="outline"
              onClick={google}
              disabled={busy}
            >
              Continue with Google
            </Button>
          </>
        )}

        <p className="mt-6 mb-0">
          Access is limited to approved club administrators.
        </p>

        <Button
          asChild
          variant="link"
          className="px-0 mt-4"
        >
          <Link to="/">Back to TechNexus</Link>
        </Button>
      </div>
    </main>
  );
}

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setNotice("Use at least 8 characters.");
      return;
    }

    if (!window.location.hash.includes("type=recovery")) {
      setNotice(
        "Open the password reset link from your email to continue.",
      );
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setNotice(
      error
        ? "This reset link may have expired. Request a new one."
        : "Your password has been updated.",
    );

    setDone(!error);
    setBusy(false);
  }

  return (
    <div className="auth-panel">
      <h1>Choose a new password.</h1>

      <p>
        Set a secure password for your administrator account.
      </p>

      {notice && (
        <div className="form-notice" role="status">
          {notice}
        </div>
      )}

      {done ? (
        <Button asChild>
          <Link to="/admin/login">
            Return to sign in
          </Link>
        </Button>
      ) : (
        <form className="auth-form" onSubmit={save}>
          <label htmlFor="new-password">
            New password
          </label>

          <input
            id="new-password"
            className="field-input"
            type="password"
            autoComplete="new-password"
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button disabled={busy} type="submit">
            Update password
          </Button>
        </form>
      )}
    </div>
  );
}
