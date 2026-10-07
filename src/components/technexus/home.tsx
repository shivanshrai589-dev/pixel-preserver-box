import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  HeartHandshake,
  Layers,
  Lightbulb,
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

  const description =
    c["hero_description"] ??
    "A student-driven technical community where curious minds learn, build, collaborate and turn ideas into real-world impact.";

  const stats = [
    ["Members", data["members"]?.length ?? 0],
    [
      "Core team",
      data["core_members"]?.filter(
        (r) => r.data["placeholder"] !== "true",
      ).length ?? 0,
    ],
    ["Activities", data["activities"]?.length ?? 0],
    [
      "Upcoming events",
      data["events"]?.filter(
        (r) => r.status === "Upcoming",
      ).length ?? 0,
    ],
  ];

  const pillars = [
    [Code2, "01", "Build", "Turn ideas into real projects"],
    [Lightbulb, "02", "Learn", "Grow with the community"],
    [Users, "03", "Collaborate", "Better together"],
    [Rocket, "04", "Create", "Make an impact"],
  ];

  return (
    <>
      {/* HERO */}
      <section className="tn-hero">
        <div className="tn-grid-lines" aria-hidden="true" />

        <div className="tn-stars" aria-hidden="true">
          <span className="tn-star tn-star-a" />
          <span className="tn-star tn-star-b" />
          <span className="tn-star tn-star-c" />
          <span className="tn-star tn-star-d" />
          <span className="tn-star tn-star-e" />
        </div>

        <div className="container-wide tn-hero-inner">
          <div className="tn-hero-copy">
            <div className="tn-eyebrow">
              CHANDIGARH UNIVERSITY · DEPARTMENT OF AIT-CSE
            </div>

            <h1>
              {title === "Ideas are better in orbit." ? (
                <>
                  Ideas are
                  <br />
                  better in <span>orbit.</span>
                </>
              ) : (
                title
              )}
            </h1>

            <p>{description}</p>

            <div className="tn-hero-actions">
              <Button
                asChild
                size="lg"
                className="tn-primary-button"
              >
                <Link to="/join">
                  Find Your People
                  <ArrowUpRight />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="tn-outline-button"
              >
                <Link to="/events">
                  Explore Events
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          {/* PURE CSS ORBITAL GRAPHIC */}
          <div
            className="tn-orbit-stage"
            aria-label="TechNexus orbital graphic representing learning, building, collaboration and innovation"
          >
            <div className="tn-orbit-glow" />

            <div className="tn-orbit orbit-one" />
            <div className="tn-orbit orbit-two" />
            <div className="tn-orbit orbit-three" />
            <div className="tn-orbit orbit-four" />

            <div className="tn-orbit-node node-one" />
            <div className="tn-orbit-node node-two" />
            <div className="tn-orbit-node node-three" />
            <div className="tn-orbit-node node-four" />

            <div className="tn-orbit-core">
              <div className="tn-orbit-core-inner">
                <Rocket />
              </div>
            </div>

            <div className="tn-orbit-label label-learn">
              LEARN
            </div>

            <div className="tn-orbit-label label-build">
              BUILD
            </div>

            <div className="tn-orbit-label label-collaborate">
              COLLABORATE
            </div>

            <div className="tn-orbit-label label-innovate">
              INNOVATE
            </div>

            <div className="tn-cross cross-one" />
            <div className="tn-cross cross-two" />
            <div className="tn-cross cross-three" />
          </div>
        </div>

        {/* PILLARS */}
        <div className="tn-hero-bottom">
          <div className="container-wide tn-pillar-grid">
            {pillars.map(
              ([Icon, number, name, text]) => {
                const I = Icon as typeof Code2;

                return (
                  <div
                    className="tn-pillar"
                    key={number as string}
                  >
                    <span className="tn-pillar-number">
                      {number as string}
                    </span>

                    <I />

                    <div>
                      <strong>{name as string}</strong>
                      <span>{text as string}</span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="tn-community">
        <div className="container-wide">
          <div className="tn-community-grid">
            <div>
              <div className="tn-section-eyebrow">
                01 / OUR COMMUNITY
              </div>

              <h2>
                Not just a club.
                <br />
                A place to belong.
              </h2>
            </div>

            <div className="tn-community-copy">
              <p>
                {c["about"] ??
                  "TechNexus is a student-driven technical community at Chandigarh University, where people come together to learn, build, experiment and grow."}
              </p>

              <Link
                to="/about"
                className="tn-text-link"
              >
                Learn more about us
                <ArrowRight />
              </Link>
            </div>

            <div className="tn-stats">
              {stats.map(([label, count]) => (
                <div
                  className="tn-stat"
                  key={label as string}
                >
                  <strong>{count}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CSS-ONLY GRAPHIC */}
            <div
              className="tn-community-art"
              aria-hidden="true"
            >
              <div className="tn-art-square" />

              <div className="tn-art-ring art-ring-one" />
              <div className="tn-art-ring art-ring-two" />
              <div className="tn-art-ring art-ring-three" />

              <div className="tn-art-core">
                <Rocket />
              </div>

              <span className="tn-art-dot art-dot-one" />
              <span className="tn-art-dot art-dot-two" />
              <span className="tn-art-dot art-dot-three" />

              <span className="tn-art-word">
                TECHNEXUS
              </span>

              <span className="tn-art-sub">
                CHANDIGARH UNIVERSITY · AIT-CSE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="tn-dark-section">
        <div className="container-wide">
          <div className="tn-section-head">
            <div>
              <div className="tn-section-eyebrow tn-eyebrow-gold">
                02 / BEYOND THE CLASSROOM
              </div>

              <h2>
                Curiosity, put into practice.
              </h2>
            </div>

            <Button
              variant="link"
              asChild
              className="tn-dark-link"
            >
              <Link to="/activities">
                View all activities
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          {data["activities"]?.length ? (
            <div className="tn-activity-list">
              {data["activities"]
                .slice(0, 4)
                .map((r, index) => (
                  <article
                    className="tn-activity-row"
                    key={r.id}
                  >
                    <span className="tn-row-number">
                      0{index + 1}
                    </span>

                    <div className="tn-row-icon">
                      {index % 3 === 0 ? (
                        <Code2 />
                      ) : index % 3 === 1 ? (
                        <Lightbulb />
                      ) : (
                        <Layers />
                      )}
                    </div>

                    <div className="tn-row-main">
                      <span>
                        {r.data["category"] ??
                          "Activity"}
                      </span>

                      <h3>{r.data["title"]}</h3>
                    </div>

                    <p>{r.data["description"]}</p>

                    <ArrowUpRight className="tn-row-arrow" />
                  </article>
                ))}
            </div>
          ) : (
            <div className="tn-dark-empty">
              <Empty type="activities" />
            </div>
          )}
        </div>
      </section>

      {/* PEOPLE */}
      <section className="tn-people-section">
        <div className="container-wide">
          <div className="tn-section-head">
            <div>
              <div className="tn-section-eyebrow">
                03 / THE PEOPLE
              </div>

              <h2>
                The minds behind the momentum.
              </h2>
            </div>

            <Button variant="link" asChild>
              <Link to="/core-team">
                Meet the whole team
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          <div className="tn-people-grid">
            {data["core_members"]
              ?.slice(0, 4)
              .map((r) => (
                <PersonCard
                  row={r}
                  key={r.id}
                />
              ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="tn-events-section">
        <div className="container-wide">
          <div className="tn-section-head">
            <div>
              <div className="tn-section-eyebrow tn-eyebrow-gold">
                04 / WHAT’S NEXT
              </div>

              <h2>
                Meet ideas in motion.
              </h2>
            </div>

            <Button
              variant="link"
              asChild
              className="tn-dark-link"
            >
              <Link to="/events">
                View all events
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          {data["events"]?.some(
            (r) => r.status === "Upcoming",
          ) ? (
            <div className="tn-events-grid">
              {data["events"]
                .filter(
                  (r) => r.status === "Upcoming",
                )
                .slice(0, 3)
                .map((r) => (
                  <EventCard
                    row={r}
                    key={r.id}
                  />
                ))}
            </div>
          ) : (
            <div className="tn-dark-empty">
              <Empty type="events" />
            </div>
          )}
        </div>
      </section>

      {/* WHY TECHNEXUS */}
      <section className="tn-why-section">
        <div className="container-wide">
          <div className="tn-why-grid">
            <div>
              <div className="tn-section-eyebrow">
                05 / WHY TECHNEXUS
              </div>

              <h2>
                Make room
                <br />
                for possibility.
              </h2>
            </div>

            <div className="tn-why-list">
              {[
                [
                  BookOpen,
                  "Learn by doing",
                  "Explore new technologies through hands-on learning.",
                ],
                [
                  Users,
                  "Find your circle",
                  "Connect with people who share your interests.",
                ],
                [
                  Rocket,
                  "Build something meaningful",
                  "Bring your ideas into the world with a community beside you.",
                ],
              ].map(
                ([Icon, titleText, text], index) => {
                  const I = Icon as typeof BookOpen;

                  return (
                    <div
                      className="tn-why-row"
                      key={titleText as string}
                    >
                      <span>
                        0{index + 1}
                      </span>

                      <I />

                      <div>
                        <h3>
                          {titleText as string}
                        </h3>

                        <p>
                          {text as string}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div className="tn-volunteer-line">
            <HeartHandshake />

            <span>
              Help make the next TechNexus experience happen.
            </span>

            <Button
              variant="link"
              asChild
            >
              <Link to="/volunteer">
                Become a volunteer
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="tn-final-cta">
        <div className="container-wide tn-final-cta-inner">
          <div>
            <div className="tn-final-eyebrow">
              THERE’S A PLACE FOR YOU HERE
            </div>

            <h2>
              {c["cta"] ??
                "Your next idea starts here."}
            </h2>

            <p>
              Bring your curiosity. We’ll bring the community.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="tn-final-button"
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
