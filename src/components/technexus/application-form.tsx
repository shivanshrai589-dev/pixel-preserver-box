import { useState } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle, BookOpen, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submissionSchema, label } from "@/lib/club-schema";
import { submitApplication } from "@/lib/club.functions";
import { PageHeading } from "./public-ui";
const formFields = {
  join: [
    "name",
    "email",
    "phone",
    "student_id",
    "department",
    "year",
    "skills",
    "interests",
    "github",
    "linkedin",
    "motivation",
  ],
  volunteer: [
    "name",
    "email",
    "phone",
    "student_id",
    "department",
    "year",
    "interests",
    "experience",
    "motivation",
    "availability",
  ],
  contact: ["name", "email", "subject", "message"],
} as const;
export function ApplicationForm({ kind }: { kind: "join" | "volunteer" | "contact" }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const title = {
    join: "Find your place in the orbit.",
    volunteer: "Be part of what makes it happen.",
    contact: "Let’s start a conversation.",
  }[kind];
  const description = {
    join: "Join a community where your curiosity is welcome and your ideas have room to grow.",
    volunteer: "Give your time, share your strengths, and help shape the TechNexus experience.",
    contact: "Have a question, an idea, or something to share? We’d love to hear from you.",
  }[kind];
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const parsed = submissionSchema.safeParse({ kind, data: values });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[String(i.path.at(-1))] = i.message));
      setErrors(next);
      return;
    }
    setBusy(true);
    setErrors({});
    setError("");
    try {
      await submitApplication({ data: parsed.data });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title={title}
        description={description}
        eyebrow={kind === "contact" ? "GET IN TOUCH" : "GET INVOLVED"}
      />
      <section className="section">
        <div className="container-wide form-layout">
          <div>
            <div className="eyebrow">
              {kind === "contact" ? "WE’RE LISTENING" : "YOUR IDEAS BELONG HERE"}
            </div>
            <h2 className="section-title">
              {kind === "contact"
                ? "A good idea starts with hello."
                : "Small steps. Real possibilities."}
            </h2>
            <p className="section-copy">
              {kind === "volunteer"
                ? "Help organise experiences, support your peers, and develop skills through purposeful teamwork. Every contribution matters."
                : kind === "join"
                  ? "Whether you’re exploring your first line of code or bringing a new project to life, there’s space for you to learn and contribute."
                  : "Send a message to the TechNexus team. Your message will be received by our administrators."}
            </p>
            {kind !== "contact" && (
              <div className="mt-8 space-y-6">
                {[
                  [BookOpen, "Learn through experience"],
                  [Users, "Work with a community"],
                  [Lightbulb, "Bring your ideas to life"],
                ].map(([Icon, text]) => {
                  const I = Icon as typeof BookOpen;
                  return (
                    <div key={text as string} className="flex items-center gap-3">
                      <I className="size-5 text-muted-foreground" />
                      <span>{text as string}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            {success ? (
              <div className="form-success" role="status">
                <CheckCircle2 className="text-primary size-8" />
                <h2>{kind === "contact" ? "Message received." : "You’re on our radar."}</h2>
                <p className="section-copy">
                  {kind === "contact"
                    ? "Thank you for reaching out. Your message has been sent to the team."
                    : "Thank you for your interest in TechNexus. Your application has been received for review."}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                {error && (
                  <div role="alert" className="form-notice text-destructive">
                    {error}
                  </div>
                )}
                <div className="form-grid">
                  {formFields[kind].map((key) => {
                    const long = ["motivation", "message", "experience", "availability"].includes(
                      key,
                    );
                    const optional = [
                      "phone",
                      "student_id",
                      "github",
                      "linkedin",
                      "experience",
                    ].includes(key);
                    return (
                      <div key={key} className={`field ${long ? "field-wide" : ""}`}>
                        <label htmlFor={key}>
                          {key === "name"
                            ? "Full name"
                            : key === "motivation"
                              ? kind === "join"
                                ? "Why would you like to join?"
                                : "Why would you like to volunteer?"
                              : key === "interests" && kind === "volunteer"
                                ? "Area of interest"
                                : label(key)}
                          {optional ? " (optional)" : " *"}
                        </label>
                        {key === "year" ? (
                          <select
                            id={key}
                            className="field-input"
                            value={values[key] ?? ""}
                            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                          >
                            <option value="">Select your year</option>
                            {["1", "2", "3", "4", "Postgraduate", "Other"].map((y) => (
                              <option key={y}>{y}</option>
                            ))}
                          </select>
                        ) : long ? (
                          <textarea
                            id={key}
                            className="field-input"
                            rows={4}
                            maxLength={3000}
                            value={values[key] ?? ""}
                            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                          />
                        ) : (
                          <input
                            id={key}
                            className="field-input"
                            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                            maxLength={
                              key === "name"
                                ? 100
                                : key === "email"
                                  ? 255
                                  : key === "phone"
                                    ? 30
                                    : 1000
                            }
                            value={values[key] ?? ""}
                            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                            aria-invalid={!!errors[key]}
                          />
                        )}{" "}
                        {errors[key] && (
                          <span className="field-error" role="alert">
                            {errors[key]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="hidden-trap" aria-hidden="true">
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => setValues({ ...values, website: e.target.value })}
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <Button type="submit" size="lg" disabled={busy}>
                    {busy ? <LoaderCircle className="spin" /> : <ArrowUpRight />}
                    {busy ? "Sending…" : kind === "contact" ? "Send message" : "Submit application"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Your details are shared only with the club team.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
