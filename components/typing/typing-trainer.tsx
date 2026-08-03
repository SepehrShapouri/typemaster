"use client"

import {
  IconClock,
  IconPalette,
  IconPlayerPlay,
  IconRefresh,
  IconTargetArrow,
  IconTrophy,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react"
import { memo, useCallback, useEffect, useRef, useState } from "react"

import Keyboard, {
  type KeyboardInteractionEvent,
  type KeyboardThemeName,
} from "@/components/ui/keyboard"

const LESSON_TEXT =
  "asdf fdsa sadf dads asdf fast daft sass dads fad asdf fdsa sadf daft sass fast fad dads asdf fdsa"
const LESSON_CHARACTERS = Array.from(LESSON_TEXT)
const MemoizedKeyboard = memo(Keyboard)

const THEME_ORDER: KeyboardThemeName[] = [
  "mint",
  "royal",
  "dolch",
  "sand",
  "scarlet",
  "classic",
]

const THEME_LABELS: Record<KeyboardThemeName, string> = {
  classic: "Classic",
  mint: "Mint",
  royal: "Royal",
  dolch: "Dolch",
  sand: "Sand",
  scarlet: "Scarlet",
}

const FINGER_GUIDE = [
  { character: "a", code: "KeyA", finger: "Pinky" },
  { character: "s", code: "KeyS", finger: "Ring" },
  { character: "d", code: "KeyD", finger: "Middle" },
  { character: "f", code: "KeyF", finger: "Index" },
  { character: " ", code: "Space", finger: "Thumb" },
] as const

type ExerciseStatus = "idle" | "active" | "complete"
type FeedbackState = "neutral" | "correct" | "error"

function codeToCharacter(code: string) {
  if (code === "Space") {
    return " "
  }

  if (/^Key[A-Z]$/.test(code)) {
    return code.slice(3).toLowerCase()
  }

  return null
}

function characterToCode(character: string) {
  if (character === " ") {
    return "Space"
  }

  return `Key${character.toUpperCase()}`
}

function isScoredKey(code: string) {
  return /^Key[A-Z]$/.test(code) || code === "Space"
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, "0")

  return `${minutes}:${seconds}`
}

function getFingerInstruction(character: string) {
  const match = FINGER_GUIDE.find((item) => item.character === character)

  if (!match) {
    return "Keep your fingers on the home row"
  }

  if (match.character === " ") {
    return "Press Space with either thumb"
  }

  return `Press ${match.character.toUpperCase()} with your left ${match.finger.toLowerCase()}`
}

export function TypingTrainer() {
  const [status, setStatus] = useState<ExerciseStatus>("idle")
  const [feedback, setFeedback] = useState<FeedbackState>("neutral")
  const [typedIndex, setTypedIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [keyboardTheme, setKeyboardTheme] = useState<KeyboardThemeName>("mint")

  const statusRef = useRef<ExerciseStatus>("idle")
  const typedIndexRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const practiceRegionRef = useRef<HTMLDivElement>(null)

  const currentCharacter = LESSON_TEXT[typedIndex] ?? ""
  const currentCode = currentCharacter
    ? characterToCode(currentCharacter)
    : null
  const progress = (typedIndex / LESSON_TEXT.length) * 100
  const accuracy =
    attempts === 0 ? 100 : Math.round((typedIndex / attempts) * 100)
  const wordsPerMinute =
    elapsedMs > 0 ? Math.round(typedIndex / 5 / (elapsedMs / 60_000)) : 0

  const getLiveMessage = () => {
    if (status === "idle") {
      return "Ready when you are."
    }

    if (status === "complete") {
      return `Drill complete in ${formatTime(elapsedMs)} with ${mistakes} ${
        mistakes === 1 ? "mistake" : "mistakes"
      }.`
    }

    if (feedback === "error") {
      return `Not quite. ${getFingerInstruction(currentCharacter)}.`
    }

    if (feedback === "correct") {
      return "Nice. Keep your shoulders loose and your eyes on the text."
    }

    if (startedAt === null) {
      return "Timer starts with your first key."
    }

    return getFingerInstruction(currentCharacter)
  }

  const liveMessage = getLiveMessage()

  const setExerciseStatus = useCallback((nextStatus: ExerciseStatus) => {
    statusRef.current = nextStatus
    setStatus(nextStatus)
  }, [])

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }
  }, [])

  const showTransientFeedback = useCallback(
    (nextFeedback: FeedbackState) => {
      clearFeedbackTimeout()
      setFeedback(nextFeedback)

      feedbackTimeoutRef.current = setTimeout(
        () => {
          setFeedback("neutral")
          feedbackTimeoutRef.current = null
        },
        nextFeedback === "error" ? 520 : 260
      )
    },
    [clearFeedbackTimeout]
  )

  const resetExercise = useCallback(
    (nextStatus: ExerciseStatus) => {
      clearFeedbackTimeout()
      typedIndexRef.current = 0
      startedAtRef.current = null
      setTypedIndex(0)
      setAttempts(0)
      setMistakes(0)
      setElapsedMs(0)
      setStartedAt(null)
      setFeedback("neutral")
      setExerciseStatus(nextStatus)
    },
    [clearFeedbackTimeout, setExerciseStatus]
  )

  const beginExercise = useCallback(() => {
    resetExercise("active")
    requestAnimationFrame(() => practiceRegionRef.current?.focus())
  }, [resetExercise])

  const handleKeyEvent = useCallback(
    (event: KeyboardInteractionEvent) => {
      if (
        event.phase !== "down" ||
        statusRef.current !== "active" ||
        !isScoredKey(event.code)
      ) {
        return
      }

      const now = performance.now()

      if (startedAtRef.current === null) {
        startedAtRef.current = now
        setStartedAt(now)
      }

      setAttempts((value) => value + 1)

      const nextCharacter = codeToCharacter(event.code)
      const expectedCharacter = LESSON_TEXT[typedIndexRef.current]

      if (nextCharacter !== expectedCharacter) {
        setMistakes((value) => value + 1)
        showTransientFeedback("error")
        return
      }

      const nextIndex = typedIndexRef.current + 1
      typedIndexRef.current = nextIndex
      setTypedIndex(nextIndex)

      if (nextIndex >= LESSON_TEXT.length) {
        const startTime = startedAtRef.current ?? now
        const finalTime = now - startTime
        setElapsedMs(finalTime)
        setExerciseStatus("complete")
        setFeedback("correct")
        clearFeedbackTimeout()
        return
      }

      showTransientFeedback("correct")
    },
    [clearFeedbackTimeout, setExerciseStatus, showTransientFeedback]
  )

  const cycleKeyboardTheme = useCallback(() => {
    setKeyboardTheme((currentTheme) => {
      const currentIndex = THEME_ORDER.indexOf(currentTheme)
      return THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length]
    })
  }, [])

  useEffect(() => {
    if (status !== "active" || startedAt === null) {
      return
    }

    const timer = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt)
    }, 1_000)

    return () => window.clearInterval(timer)
  }, [startedAt, status])

  useEffect(() => {
    return () => clearFeedbackTimeout()
  }, [clearFeedbackTimeout])

  return (
    <section
      id="practice"
      className="trainer-card"
      aria-labelledby="practice-title"
    >
      <div className="trainer-toolbar">
        <div className="trainer-kicker">
          <span className="trainer-status-dot" data-status={status} />
          <div>
            <span>Live practice</span>
            <strong id="practice-title">
              {status === "idle"
                ? "Ready"
                : status === "active"
                  ? "In progress"
                  : "Complete"}
            </strong>
          </div>
        </div>

        <dl className="trainer-stats" id="progress">
          <div>
            <dt>
              <IconClock aria-hidden="true" />
              Time
            </dt>
            <dd>{formatTime(elapsedMs)}</dd>
          </div>
          <div>
            <dt>Speed</dt>
            <dd>
              {wordsPerMinute}
              <span>wpm</span>
            </dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>
              {accuracy}
              <span>%</span>
            </dd>
          </div>
          <div>
            <dt>Errors</dt>
            <dd>{mistakes}</dd>
          </div>
        </dl>

        <div className="trainer-controls" aria-label="Keyboard controls">
          <button
            type="button"
            className="trainer-control"
            onClick={() => setSoundEnabled((value) => !value)}
            aria-pressed={soundEnabled}
            aria-label={
              soundEnabled ? "Turn key sounds off" : "Turn key sounds on"
            }
          >
            {soundEnabled ? (
              <IconVolume aria-hidden="true" />
            ) : (
              <IconVolumeOff aria-hidden="true" />
            )}
            <span>{soundEnabled ? "Sound on" : "Sound off"}</span>
          </button>
          <button
            type="button"
            className="trainer-control"
            onClick={cycleKeyboardTheme}
            aria-label={`Change keyboard theme. Current theme: ${THEME_LABELS[keyboardTheme]}`}
          >
            <IconPalette aria-hidden="true" />
            <span>{THEME_LABELS[keyboardTheme]}</span>
          </button>
          {status !== "idle" && (
            <button
              type="button"
              className="trainer-control"
              onClick={beginExercise}
              aria-label="Restart exercise"
            >
              <IconRefresh aria-hidden="true" />
              <span>Restart</span>
            </button>
          )}
        </div>
      </div>

      <div
        ref={practiceRegionRef}
        className="exercise-region"
        data-feedback={feedback}
        data-status={status}
        aria-label="Typing exercise prompt"
        tabIndex={-1}
      >
        <div
          className="exercise-progress-track"
          role="progressbar"
          aria-label="Exercise progress"
          aria-valuemin={0}
          aria-valuemax={LESSON_TEXT.length}
          aria-valuenow={typedIndex}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="exercise-heading-row">
          <div>
            <span className="exercise-overline">Exercise 01</span>
            <h2>Home Row Rhythm</h2>
          </div>
          <span className="exercise-count">
            {typedIndex}/{LESSON_TEXT.length}
          </span>
        </div>

        <div
          className="exercise-copy"
          aria-label={`Typing exercise text: ${LESSON_TEXT}`}
          data-testid="exercise-copy"
        >
          {LESSON_CHARACTERS.map((character, index) => {
            const state =
              index < typedIndex
                ? "done"
                : index === typedIndex
                  ? "current"
                  : "upcoming"

            return (
              <span
                key={`${character}-${index}`}
                className="exercise-character"
                data-state={state}
                aria-hidden="true"
              >
                {character}
              </span>
            )
          })}
        </div>

        <div className="exercise-feedback-row">
          <p
            className="exercise-feedback"
            aria-live={
              feedback === "error" || status === "complete" ? "polite" : "off"
            }
          >
            <span className="feedback-icon" aria-hidden="true">
              {status === "complete" ? (
                <IconTrophy aria-hidden="true" />
              ) : feedback === "error" ? (
                "!"
              ) : (
                <IconTargetArrow aria-hidden="true" />
              )}
            </span>
            {liveMessage}
          </p>

          {status === "idle" && (
            <button
              type="button"
              className="primary-action"
              onClick={beginExercise}
              data-testid="start-exercise"
            >
              <IconPlayerPlay aria-hidden="true" />
              Start Exercise
            </button>
          )}

          {status === "complete" && (
            <button
              type="button"
              className="primary-action"
              onClick={beginExercise}
            >
              <IconRefresh aria-hidden="true" />
              Repeat Drill
            </button>
          )}
        </div>
      </div>

      <div className="keyboard-zone">
        <div className="target-instruction">
          <div>
            <span>Next key</span>
            <strong>
              {status === "complete"
                ? "Drill complete"
                : getFingerInstruction(currentCharacter)}
            </strong>
          </div>
          <kbd>
            {currentCharacter === " "
              ? "SPACE"
              : currentCharacter.toUpperCase() || "✓"}
          </kbd>
        </div>

        <div className="mobile-key-row" aria-label="Touch typing controls">
          {FINGER_GUIDE.map((item) => (
            <button
              key={item.code}
              type="button"
              data-wide={item.code === "Space"}
              data-target={currentCode === item.code && status !== "complete"}
              onClick={() =>
                handleKeyEvent({
                  code: item.code,
                  phase: "down",
                  source: "pointer",
                })
              }
              disabled={status !== "active"}
              aria-label={`Type ${item.character === " " ? "space" : item.character}`}
            >
              {item.character === " " ? "space" : item.character.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="keyboard-scale-stage" aria-label="Interactive keyboard">
          <div className="keyboard-scale-inner">
            <MemoizedKeyboard
              theme={keyboardTheme}
              enableHaptics
              enableSound={soundEnabled}
              targetKey={status === "complete" ? null : currentCode}
              capturePhysicalInput={status === "active"}
              onKeyEvent={handleKeyEvent}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
