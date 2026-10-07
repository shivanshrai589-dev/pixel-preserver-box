import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  HeartHandshake,
  Lightbulb,
  Layers,
  Rocket,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubQuery } from "@/lib/club-query";
import { Empty, EventCard, PersonCard } from "./public-ui";

export function Home() {
  const { data } = useSuspenseQuery(clubQuery);

  const c = data["club_content"]?.[0]?.data ?? {};
  const title = c["hero_title"] ?? "Ideas are better in orbit.";

  const members = data["members"]?.length ?? 0;
  const coreTeam =
    data["core_members"]?.filter(
      (r) => r.data["placeholder"] !== "true",
    ).length ?? 0;
  const activities = data["activities"]?.length ?? 0;
  const upcomingEvents =
    data["events"]?.filter((r) => r.status === "Upcoming").length ?? 0;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#061126] text-white">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -right-32 top-16 h-[620px] w-[620px] rounded-full border border-[#eab83f]" />
          <div className="absolute -right-16 top-32 h-[500px] w-[500px] rounded-full border border-white/20 rotate-12" />
          <div className="absolute right-12 top-48 h-[360px] w-[360px] rounded-full border border-[#eab83f]/50 -rotate-12" />
        </div>

        <div className="container-wide relative min-h-[650px] flex items-center">
          <div className="grid w-full gap-12 py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="max-w-4xl">
              <div className="mb-8 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-[#eab83f]">
                <span className="h-2 w-2 rounded-full bg-[#eab83f]" />
                CHANDIGARH UNIVERSITY · DEPARTMENT OF AIT-CSE
              </div>

              <h1 className="max-w-5xl text-6xl font-bold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[7.4rem]">
                {title === "Ideas are better in orbit." ? (
                  <>
                    Ideas are
                    <br />
                    better in{" "}
                    <span className="text-[#eab83f]">orbit.</span>
                  </>
                ) : (
                  title
                )}
              </h1>

              <div className="mt-10 max-w-2xl border-l border-[#eab83f] pl-6">
                <p className="text-lg leading-8 text-white/65">
                  {c["hero_description"] ??
                    "A student-driven technical community where curious minds learn, build, collaborate and turn ideas into real-world impact."}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#eab83f] text-[#061126] hover:bg-[#f2c95b]"
                >
                  <Link to="/join">
                    Find Your People
                    <ArrowUpRight />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  asChild
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/events">
                    Explore Events
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative hidden min-h-[430px] lg:block">
              <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="absolute left-1/2 top-1/2 h-[245px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#eab83f]/50 rotate-[32deg]" />
              <div className="absolute left-1/2 top-1/2 h-[245px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/15 -rotate-[32deg]" />

              <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border border-[#eab83f]">
                <Rocket className="h-11 w-11 -rotate-45 text-[#eab83f]" strokeWidth={1.4} />
              </div>

              <div className="absolute left-[14%] top-[18%] text-xs tracking-[0.2em] text-white/45">
                LEARN
              </div>

              <div className="absolute right-[8%] top-[30%] text-xs tracking-[0.2em] text-[#eab83f]">
                BUILD
              </div>

              <div className="absolute bottom-[18%] left-[18%] text-xs tracking-[0.2em] text-white/45">
                COLLABORATE
              </div>

              <div className="absolute bottom-[12%] right-[10%] text-xs tracking-[0.2em] text-white/45">
                INNOVATE
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.45em] text-white/30">
                DIFFERENT MINDS · ONE ORBIT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="border-b border-border bg-background">
        <div className="container-wide grid md:grid-cols-4">
          {[
            [Code2, "01", "Technology"],
            [Lightbulb, "02", "Innovation"],
            [Users, "03", "Collaboration"],
            [Layers, "04", "Community"],
          ].map(([Icon, number, text]) => {
            const I = Icon as typeof Code2;

            return (
              <div
                key={text as string}
                className="flex items-center gap-4 border-r border-border px-6 py-7 first:border-l last:border-r-0"
              >
                <I className="size-5 text-primary" strokeWidth={1.5} />
                <div>
                  <span className="block text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                    {number as string}
                  </span>
                  <span className="text-sm font-semibold">
                    {text as string}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="container-wide">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="eyebrow">01 / OUR COMMUNITY</div>

              <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-[-0.04em] md:text-6xl">
                Not just a club.
                <br />
                A place to belong.
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-xl leading-9 text-muted-foreground md:text-2xl">
                {c["about"] ??
                  "TechNexus is a student-driven technical community where people come together to learn, build, experiment and grow."}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                  DIFFERENT SKILLS. SHARED AMBITION.
                </span>

                <Button variant="link" asChild className="px-0">
                  <Link to="/about">
                    Discover TechNexus
                    <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-24 grid border-y border-border md:grid-cols-4">
            {[
              ["Members", members],
              ["Core team", coreTeam],
              ["Activities", activities],
              ["Upcoming events", upcomingEvents],
            ].map(([label, count]) => (
              <div
                key={label}
                className="border-b border-border px-6 py-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <strong className="block text-5xl font-bold tracking-[-0.05em]">
                  {count}
                </strong>
                <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="border-b border-border bg-[#f6f7f9] py-24 md:py-32">
        <div className="container-wide">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">02 / BEYOND THE CLASSROOM</div>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">
                Curiosity,
                <br />
                put into practice.
              </h2>
            </div>

            <Button variant="link" asChild className="px-0">
              <Link to="/activities">
                View all activities
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          {data["activities"]?.length ? (
            <div className="divide-y divide-border border-y border-border">
              {data["activities"].slice(0, 4).map((r, index) => (
                <article
                  key={r.id}
                  className="grid gap-5 py-8 transition-colors hover:bg-white md:grid-cols-[80px_1fr_2fr_auto] md:items-center md:px-5"
                >
                  <span className="text-sm font-semibold text-primary">
                    0{index + 1}
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {r.data["category"] ?? "Activity"}
                  </span>

                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.025em]">
                      {r.data["title"]}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {r.data["description"]}
                    </p>
                  </div>

                  <ArrowUpRight className="hidden size-5 text-primary md:block" />
                </article>
              ))}
            </div>
          ) : (
            <Empty type="activities" />
          )}
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="container-wide">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">03 / THE PEOPLE</div>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">
                Meet the people
                <br />
                behind the momentum.
              </h2>
            </div>

            <Button variant="link" asChild className="px-0">
              <Link to="/core-team">
                Meet the whole team
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {data["core_members"]?.slice(0, 4).map((r) => (
              <PersonCard row={r} key={r.id} />
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="border-b border-border bg-[#061126] py-24 text-white md:py-32">
        <div className="container-wide">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-semibold tracking-[0.2em] text-[#eab83f]">
                04 / WHAT’S NEXT
              </div>

              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">
                Meet ideas
                <br />
                in motion.
              </h2>
            </div>

            <Button
              variant="outline"
              asChild
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/events">
                All events
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          {data["events"]?.some((r) => r.status === "Upcoming") ? (
            <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2 lg:grid-cols-3">
              {data["events"]
                .filter((r) => r.status === "Upcoming")
                .slice(0, 3)
                .map((r) => (
                  <EventCard row={r} key={r.id} />
                ))}
            </div>
          ) : (
            <div className="border-y border-white/15 py-16">
              <Empty type="events" />
            </div>
          )}
        </div>
      </section>

      {/* THREE IDEAS */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="container-wide">
          <div className="grid gap-16 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <div className="eyebrow">05 / WHY TECHNEXUS</div>

              <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-5xl">
                Make room
                <br />
                for possibility.
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {[
                [
                  BookOpen,
                  "Learn by doing",
                  "Explore new technologies and grow through hands-on learning.",
                ],
                [
                  Users,
                  "Find your circle",
                  "Connect with people who share your interests and challenge your thinking.",
                ],
                [
                  Rocket,
                  "Build something meaningful",
                  "Bring your ideas into the world with a community beside you.",
                ],
              ].map(([Icon, heading, text], index) => {
                const I = Icon as typeof BookOpen;

                return (
                  <div
                    key={heading as string}
                    className="grid gap-5 py-8 md:grid-cols-[60px_1fr_1.4fr] md:items-center"
                  >
                    <span className="text-sm font-semibold text-primary">
                      0{index + 1}
                    </span>

                    <div className="flex items-center gap-3">
                      <I className="size-5 text-primary" strokeWidth={1.5} />
                      <h3 className="text-xl font-bold">
                        {heading as string}
                      </h3>
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {text as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <HeartHandshake className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Help make the next TechNexus experience happen.
              </p>
            </div>

            <Button variant="link" asChild className="px-0">
              <Link to="/volunteer">
                Become a volunteer
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#eab83f] py-20 text-[#061126] md:py-28">
        <div className="container-wide flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold tracking-[0.2em]">
              THERE’S A PLACE FOR YOU HERE
            </div>

            <h2 className="mt-5 max-w-3xl text-5xl font-bold tracking-[-0.05em] md:text-7xl">
              {c["cta"] ?? "Your next idea starts here."}
            </h2>

            <p className="mt-5 text-lg text-[#061126]/70">
              Bring your curiosity. We’ll bring the community.
            </p>
          </div>

          <Button
            size="lg"
            asChild
            className="bg-[#061126] text-white hover:bg-[#101e38]"
          >
            <Link to="/join">
              Join TechNexus
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
