"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

type StatementType = "correlation" | "causation"

interface Statement {
  text: string
  type: StatementType
  explanation: string
}

const statements: Statement[] = [
  {
    text: "Mehr sportliche betätigung verursacht Hautkrebs.",
    type: "correlation",
    explanation: "Es gibt eine Korrelation zwischen Hautkrebs und sportlicher Betätigung, aber der Grund dafür ist nicht der Sport. Die Korrelation lässt sich damit begründen, dass Sportler sich oft längere Zeit im Freien an der Sonne aufhalten und daher ein höheres Risiko für Hautkrebs haben.",
  },
  {
    text: "Der Konsum von \"Zero\"- oder \"Diät\"-Getränken führt zu starkem Übergewicht.",
    type: "correlation",
    explanation:
      "Die Verwendung von Sonnencreme steigt immer an, aber auch die Fälle von Hautkrebs steigen weiter an. Könnte Sonnencreme ein Grund für den Hautkrebs sein? Obwohl eine Korrelation zwischen den Daten besteht, ist dies nicht der Fall, die Sonnencreme gibt ein Sicherheitsgefühl und daher bleiben Menschen, welche sie verwenden, zu lange an der Sonne.",
  },
  {
    text: "Verwendung von Sonnencreme erhöht das Risiko auf Hautkrebs",
    type: "correlation",
    explanation:
      "Diese Korrelation existiert bei Kindern, weil beides mit dem Alter wächst. Die Schuhgröße verursacht keine bessere Lesefähigkeit.",
  },
  {
    text: "Eine Studie zeigt, dass Nachhilfeunterricht die Schüler welche diesen besuchen, ist mehr verwirrt und schlussendlich ihre Noten sogar verschlechtert",
    type: "correlation",
    explanation:
      "Schüler, die Nachhilfeunterricht besuchen, haben im Durchschnitt schlechtere Noten als Schüler, welche keinen besucht haben. Da liegt aber der Grund nicht am Nachhilfeunterricht sondern daran, dass Schüler welche gute Noten schreiben brauchen sowieso keinen Nachhilfeunterricht, sondern meist nur die Schüler welche sich schwer tun in der Schule besuchen ihn.",
  },
  {
    text: "Das Spielen von Ego-Shooter-Spielen, macht Jugendliche aggressiver und führt zu Amokläufen an Schulen",
    type: "correlation",
    explanation:
      "Man kann sehen, dass aggressive Jugendliche oft auch Ego-Shooter-Spiele spielen, das heißt aber nicht, dass es Jugendliche aggressiv macht, sondern dass aggressive Kinder eher zu solchen Spielen hingezogen sind"
    },
  {
    text: "Wenn mehr Straßen gebaut werden, folgt daraus, dass mehr verkehr ist.",
    type: "causation",
    explanation:
      "Wenn die Infrastruktur für Straßen verbessert wird, dann wird dadurch die Fahrzeit verringert, wodurch es sich wieder für mehr Menschen rentiert mit dem Auto zu fahren.",
  },
  {
    text: "Kaugummi kauen, verbessert die Prüfungsleistung",
    type: "causation",
    explanation: "Durch Kaugummi kauen erhöht sich die Blutzufuhr zum Gehirn wodurch man Aufmerksamer wird",
  },
  {
    text: "Eine Grippeimpfung senkt das Risiko für Herzinfarkte.",
    type: "causation",
    explanation:
      "Die Impfung verhindert, dass Entzündungsreaktionen entstehen, diese Entzündungen sind ein Risikofaktor für Herzinfarkte.",
  },
  {
    text: "Haustiere senken den Blutdruck",
    type: "causation",
    explanation: "Das streicheln und alleine schon die Anwesenheit eines Haustieres, senkt unser Stresslevel und auch unseren Blutdruck.",
  },
  {
    text: "Büropflanzen reduzieren Krankenstand und Fehlzeiten",
    type: "causation",
    explanation:
      "Büropflanzen können die Krankentage um bis zu 3,5 Tage pro Arbeitnehmer*in einem Jahr senken. Dies liegt daran, dass sie das Stresslevel senken, die Luftfeuchtigkeit regulieren und filter Pflanzen Schadstoffe "
  }
]

export default function CorrelationGame() {
  const [score, setScore] = useState(0)
  const [currentStatement, setCurrentStatement] = useState<Statement | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set())
  const [hoveredSide, setHoveredSide] = useState<"correlation" | "causation" | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    loadNewStatement()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || showIntro) return

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        handleAnswer("correlation")
      } else if (e.key === "ArrowRight" || e.key === "l" || e.key === "L") {
        handleAnswer("causation")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameOver, currentStatement, showIntro])

  const loadNewStatement = () => {
    const availableIndices = statements.map((_, index) => index).filter((index) => !usedStatements.has(index))

    if (availableIndices.length === 0) {
      setUsedStatements(new Set())
      const randomIndex = Math.floor(Math.random() * statements.length)
      setCurrentStatement(statements[randomIndex])
      setUsedStatements(new Set([randomIndex]))
      return
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    setCurrentStatement(statements[randomIndex])
    setUsedStatements((prev) => new Set([...prev, randomIndex]))
  }

  const handleAnswer = (answer: StatementType) => {
    if (!currentStatement || showFeedback) return

    const correct = answer === currentStatement.type
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore((prev) => prev + 1)
      setTimeout(() => {
        setShowFeedback(false)
        loadNewStatement()
      }, 600)
    } else {
      setTimeout(() => {
        setGameOver(true)
      }, 800)
    }
  }

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setShowFeedback(false)
    setUsedStatements(new Set())
    loadNewStatement()
  }

  const handleStartGame = () => {
    setShowIntro(false)
  }

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-balance">Korrelation vs Kausalität</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Teste dein Verständnis dieser grundlegenden Konzepte
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg mb-6 border border-border">
            <p className="text-lg mb-6 leading-relaxed text-balance">
              Lies jede Aussage sorgfältig und entscheide, ob sie eine <strong>Korrelation</strong> oder{" "}
              <strong>Kausalität</strong> beschreibt. Einmal falsch und das Spiel ist vorbei!
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[color:var(--correlation)]/10 border-2 border-[color:var(--correlation)]/30">
                <h3 className="font-bold text-lg mb-2 text-[color:var(--correlation)]">Korrelation</h3>
                <p className="text-sm leading-relaxed">
                  Zwei Dinge verändern sich zusammen, aber eines verursacht nicht unbedingt das andere.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[color:var(--causation)]/10 border-2 border-[color:var(--causation)]/30">
                <h3 className="font-bold text-lg mb-2 text-[color:var(--causation)]">Kausalität</h3>
                <p className="text-sm leading-relaxed">Eine Sache beeinflusst oder erzeugt die andere direkt.</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Steuerung:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Klicke auf die linke oder rechte Seite zum Antworten</li>
                <li>Verwende Pfeiltasten (← / →) oder A / L Tasten</li>
              </ul>
            </div>
          </div>

          <Button onClick={handleStartGame} size="lg" className="w-full text-lg h-14 bg-primary hover:bg-primary/90">
            Spiel starten
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="p-4 flex items-center justify-center gap-6 relative z-10">
        <h1 className="text-2xl font-bold">Causilation</h1>
        <div className="absolute right-4 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
          <span className="font-semibold">Score: {score}</span>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-4 relative z-10 pointer-events-none">
        <div className="max-w-2xl w-full">
          {currentStatement && (
            <div className="bg-card rounded-2xl p-8 shadow-2xl relative border border-border">
              {showFeedback && (
                <div
                  className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    isCorrect ? "bg-[color:var(--causation)]" : "bg-[color:var(--correlation)]"
                  }`}
                >
                  {isCorrect ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                </div>
              )}
              <p className="text-xl md:text-2xl text-center leading-relaxed text-balance">{currentStatement.text}</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-0 grid grid-cols-2 -z-10">
        {/* Correlation Side */}
        <button
          onClick={() => handleAnswer("correlation")}
          onMouseEnter={() => setHoveredSide("correlation")}
          onMouseLeave={() => setHoveredSide(null)}
          disabled={showFeedback}
          className={`relative bg-[color:var(--correlation)]/[0.03] transition-all duration-200 ${
            hoveredSide === "correlation" ? "bg-[color:var(--correlation)]/[0.08]" : ""
          } ${showFeedback ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Wähle Korrelation"
        >
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center p-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">Korrelation</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xs text-center text-balance">
              Zwei Dinge verändern sich zusammen
            </p>
          </div>
        </button>

        {/* Causation Side */}
        <button
          onClick={() => handleAnswer("causation")}
          onMouseEnter={() => setHoveredSide("causation")}
          onMouseLeave={() => setHoveredSide(null)}
          disabled={showFeedback}
          className={`relative bg-[color:var(--causation)]/[0.03] transition-all duration-200 ${
            hoveredSide === "causation" ? "bg-[color:var(--causation)]/[0.08]" : ""
          } ${showFeedback ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Wähle Kausalität"
        >
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center p-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">Kausalität</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xs text-center text-balance">
              Eines verursacht das andere direkt
            </p>
          </div>
        </button>
      </div>

      {/* Game Over Modal */}
      {gameOver && currentStatement && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-border">
            <h2 className="text-4xl font-bold mb-4 text-center">Game over!</h2>
            <p className="text-2xl text-center mb-6">
              Endscore: <span className="font-bold">{score}</span>
            </p>

            <div className="bg-muted rounded-xl p-6 mb-6 border border-border">
              <p className="text-lg mb-3">
                <strong>Aussage:</strong> {currentStatement.text}
              </p>
              <p className="mb-2">
                <strong>Richtige Antwort:</strong>{" "}
                <span
                  className={`font-semibold ${
                    currentStatement.type === "correlation"
                      ? "text-[color:var(--correlation)]"
                      : "text-[color:var(--causation)]"
                  }`}
                >
                  {currentStatement.type === "correlation" ? "Korrelation" : "Kausalität"}
                </span>
              </p>
              <p className="mb-2">
                <strong>Erklärung:</strong> {currentStatement.explanation}
              </p>
            </div>

            <Button onClick={handleRestart} size="lg" className="w-full text-lg h-14 bg-primary hover:bg-primary/90">
              Nochmal spielen
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
