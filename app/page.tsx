import {
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconFlame,
  IconKeyboard,
  IconLock,
  IconTargetArrow,
} from "@tabler/icons-react"

import { TypingTrainer } from "@/components/typing/typing-trainer"

const COURSE_STEPS = [
  { label: "Introduction", state: "complete" },
  { label: "Basic position", state: "complete" },
  { label: "Left home row", state: "active" },
  { label: "Right home row", state: "available" },
  { label: "Both hands", state: "locked" },
  { label: "Reach for G & H", state: "locked" },
] as const

export default function Page() {
  return (
    <div className="tm-app">
      <header className="tm-header">
        <a className="tm-brand" href="#lesson" aria-label="TypeMaster home">
          <span className="tm-brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="tm-brand-word">
            type<strong>master</strong>
          </span>
        </a>

        <nav className="tm-nav" aria-label="Primary navigation">
          <a href="#lesson">Learn</a>
          <a href="#practice" aria-current="page">
            Practice
          </a>
          <a href="#progress">Progress</a>
        </nav>

        <div className="tm-header-actions">
          <span className="streak-pill">
            <IconFlame aria-hidden="true" />
            <span>7 day streak</span>
          </span>
          <span className="profile-dot" aria-label="Guest profile">
            TM
          </span>
        </div>
      </header>

      <div className="tm-frame">
        <aside className="course-sidebar" aria-label="Foundations course">
          <div className="course-heading">
            <span>Course 01</span>
            <h2>Foundations</h2>
            <p>Build the muscle memory that makes speed feel effortless.</p>
          </div>

          <div className="course-progress">
            <div>
              <span>Course progress</span>
              <strong>18%</strong>
            </div>
            <div className="course-progress-track">
              <span />
            </div>
          </div>

          <ol className="course-steps">
            {COURSE_STEPS.map((step, index) => (
              <li key={step.label} data-state={step.state}>
                <span className="course-step-index">
                  {step.state === "complete" ? (
                    <IconCheck aria-hidden="true" />
                  ) : step.state === "locked" ? (
                    <IconLock aria-hidden="true" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span>{step.label}</span>
                {step.state === "active" && (
                  <IconChevronRight aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>

          <div className="sidebar-tip">
            <IconKeyboard aria-hidden="true" />
            <div>
              <strong>Keep looking up</strong>
              <p>The keyboard will guide your fingers. Trust it.</p>
            </div>
          </div>
        </aside>

        <main className="lesson-main" id="lesson">
          <div className="lesson-container">
            <div className="mobile-course-pill">
              <span>Foundations</span>
              <strong>Lesson 1 of 12</strong>
            </div>

            <div className="lesson-breadcrumb" aria-label="Breadcrumb">
              <span>Foundations</span>
              <IconChevronRight aria-hidden="true" />
              <strong>Lesson 01</strong>
            </div>

            <section className="lesson-hero">
              <div className="lesson-intro">
                <span className="lesson-eyebrow">Left hand practice</span>
                <h1>Left hand, meet the home row.</h1>
                <p>
                  Plant your fingers on A, S, D, and F. Build a steady rhythm
                  before you chase speed.
                </p>

                <div className="lesson-meta">
                  <span>
                    <IconTargetArrow aria-hidden="true" />
                    Accuracy first
                  </span>
                  <span>About 3 minutes</span>
                </div>
              </div>

              <div className="mastery-card">
                <span className="mastery-label">Mastery goal</span>
                <strong>Under 60 sec</strong>
                <p>Finish with zero mistakes to earn the gold key.</p>
                <span className="mastery-orb" aria-hidden="true">
                  <IconArrowUpRight />
                </span>
              </div>
            </section>

            <TypingTrainer />

            <section
              className="lesson-footer-grid"
              aria-label="Lesson guidance"
            >
              <article>
                <span>01</span>
                <div>
                  <h2>Find the bumps</h2>
                  <p>
                    The small ridge on F tells your index finger where home is
                    without looking down.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h2>Stay feather-light</h2>
                  <p>
                    Relax your wrists and let each finger travel only as far as
                    it needs to.
                  </p>
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
