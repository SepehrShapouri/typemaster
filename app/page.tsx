import {
  IconCheck,
  IconFlame,
  IconKeyboard,
  IconLock,
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
      <a className="skip-link" href="#practice">
        Skip to practice
      </a>

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
            <div className="course-heading-meta">
              <span>Course 01</span>
              <strong>3 / 12</strong>
            </div>
            <h2>Foundations</h2>
          </div>

          <div className="course-progress">
            <div>
              <span>Course progress</span>
              <strong>18%</strong>
            </div>
            <div
              className="course-progress-track"
              role="progressbar"
              aria-label="Course progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={18}
            >
              <span />
            </div>
          </div>

          <nav aria-label="Lesson list">
            <ol className="course-steps">
              {COURSE_STEPS.map((step, index) => (
                <li
                  key={step.label}
                  data-state={step.state}
                  aria-current={step.state === "active" ? "step" : undefined}
                >
                  <span className="course-step-index">
                    {step.state === "complete" ? (
                      <IconCheck aria-hidden="true" />
                    ) : step.state === "locked" ? (
                      <IconLock aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="course-step-label">{step.label}</span>
                  {step.state === "active" && (
                    <span className="course-step-current">Now</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="sidebar-home-row">
            <IconKeyboard aria-hidden="true" />
            <div>
              <span>Focus keys</span>
              <strong>A S D F</strong>
            </div>
          </div>
        </aside>

        <main className="lesson-main" id="lesson">
          <div className="lesson-container">
            <div className="mobile-course-pill">
              <span>Foundations</span>
              <strong>Lesson 03 / 12</strong>
            </div>

            <header className="lesson-workspace-header">
              <div className="lesson-intro">
                <span className="lesson-eyebrow">
                  Lesson 03 · Left hand practice
                </span>
                <h1>Left Home Row</h1>
                <p>
                  Build a calm, even rhythm across A, S, D, and F. Keep your
                  eyes on the prompt and let the keyboard guide your fingers.
                </p>
              </div>

              <div className="lesson-objective" aria-label="Lesson goal">
                <span className="lesson-objective-dot" aria-hidden="true" />
                <div>
                  <span>Today&apos;s goal</span>
                  <strong>95%+ accuracy</strong>
                  <small>About 3 minutes</small>
                </div>
              </div>
            </header>

            <TypingTrainer />
          </div>
        </main>
      </div>
    </div>
  )
}
