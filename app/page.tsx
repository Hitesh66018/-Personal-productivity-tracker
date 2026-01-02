"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  CheckSquare,
  Calendar,
  Target,
  Activity,
  Plus,
  Trash2,
  Heart,
  Sparkles,
  Terminal,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { getDailyQuote } from "@/lib/quotes"

interface Exam {
  id: string
  name: string
  date: string
  subject: string
}

export default function HomePage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [newExam, setNewExam] = useState({ name: "", date: "", subject: "" })
  const [showAddExam, setShowAddExam] = useState(false)
  const [dailyQuote, setDailyQuote] = useState("")
  const [mounted, setMounted] = useState(false)
  const [terminalText, setTerminalText] = useState("")

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("exams")
    if (stored) {
      setExams(JSON.parse(stored))
    }
    setDailyQuote(getDailyQuote())

    const text = "SYSTEM.READY // ACCESS GRANTED"
    let index = 0
    const interval = setInterval(() => {
      if (index <= text.length) {
        setTerminalText(text.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const addExam = () => {
    if (newExam.name && newExam.date && newExam.subject) {
      const exam = {
        ...newExam,
        id: Date.now().toString(),
      }
      const updated = [...exams, exam]
      setExams(updated)
      localStorage.setItem("exams", JSON.stringify(updated))
      setNewExam({ name: "", date: "", subject: "" })
      setShowAddExam(false)
    }
  }

  const deleteExam = (id: string) => {
    const updated = exams.filter((e) => e.id !== id)
    setExams(updated)
    localStorage.setItem("exams", JSON.stringify(updated))
  }

  const upcomingExams = exams
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <ThemeToggle />

      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm animate-fade-in glow-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary text-sm">
              <Terminal className="h-4 w-4 animate-pulse" />
              <span className="font-mono tracking-wider">{terminalText}_</span>
            </div>

            <p className="text-lg md:text-xl text-accent font-serif leading-relaxed animate-slide-in-top neon-text">
              ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्
            </p>
            <p className="text-lg md:text-xl text-accent font-serif leading-relaxed animate-slide-in-top delay-100 neon-text">
              उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्
            </p>
            <p className="text-xs text-muted-foreground animate-fade-in delay-200 tracking-widest uppercase">
              [ SHIV MRITYUNJAY MANTRA ]
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in delay-300">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-primary shadow-2xl animate-scale-in animate-glow-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay" />
              <Image
                src="/images/whatsapp-20image-202025-09-13-20at-2023.jpg"
                alt="Hitesh Bhardwaj"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-balance mb-2 text-primary neon-text tracking-wider">
                &gt; PRODUCTIVITY.TRACKER.SYS
              </h1>
              <p className="text-lg text-muted-foreground font-mono tracking-wide">
                [ MONITORING YOUR DIGITAL PROGRESS ]
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8 border-2 border-accent/30 bg-card/80 backdrop-blur-sm animate-slide-in-left delay-400 glow-border hover:border-accent/60 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent font-mono tracking-wide">
              <Sparkles className="h-5 w-5 animate-pulse" />
              DAILY.INSPIRATION.LOG
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic text-foreground leading-relaxed font-mono border-l-2 border-primary pl-4">
              {dailyQuote}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 animate-slide-in-right delay-500 glow-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-primary font-mono tracking-wide">
                <Calendar className="h-5 w-5" />
                EXAM.SCHEDULE.DB
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddExam(!showAddExam)}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-mono tracking-wider transition-all hover:shadow-lg hover:shadow-primary/50"
              >
                <Plus className="h-4 w-4 mr-1" />
                ADD.ENTRY
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddExam && (
              <div className="mb-4 p-4 border-2 border-primary/30 rounded-lg bg-secondary/50 space-y-3 animate-slide-in-top">
                <Input
                  placeholder="&gt; Exam Name..."
                  value={newExam.name}
                  onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                  className="font-mono bg-background border-primary/30 focus:border-primary"
                />
                <Input
                  placeholder="&gt; Subject..."
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="font-mono bg-background border-primary/30 focus:border-primary"
                />
                <Input
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  className="font-mono bg-background border-primary/30 focus:border-primary"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={addExam}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-mono"
                  >
                    SAVE
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddExam(false)}
                    className="flex-1 border-primary/30 text-foreground font-mono hover:bg-secondary"
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            )}

            {upcomingExams.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 font-mono">[ NO UPCOMING EXAMS SCHEDULED ]</p>
            ) : (
              <div className="space-y-2">
                {upcomingExams.map((exam, index) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 border border-primary/20 rounded-lg bg-secondary/30 hover:bg-secondary/50 hover:border-primary/40 transition-all animate-slide-in-left"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div>
                      <p className="font-semibold text-primary font-mono tracking-wide">&gt; {exam.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">// {exam.subject}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium font-mono text-accent">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteExam(exam.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/journal" className="animate-fade-in delay-600">
            <Card className="h-full glow-border hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/60 bg-card/80 backdrop-blur-sm group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors font-mono tracking-wide">
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  JOURNAL.LOG
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  // Write and reflect on daily activities
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks" className="animate-fade-in delay-700">
            <Card className="h-full glow-border hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/60 bg-card/80 backdrop-blur-sm group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors font-mono tracking-wide">
                  <CheckSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  TASK.MANAGER
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  // Manage todos with priority tracking
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/study" className="animate-fade-in delay-800">
            <Card className="h-full glow-border hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/60 bg-card/80 backdrop-blur-sm group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors font-mono tracking-wide">
                  <Target className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  STUDY.TRACKER
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  // Track subjects and learning time
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/habits" className="animate-fade-in delay-900">
            <Card className="h-full glow-border hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/60 bg-card/80 backdrop-blur-sm group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors font-mono tracking-wide">
                  <Activity className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  HABIT.MONITOR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  // Build consistency and track habits
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="mt-16 border-t border-primary/30 bg-card/50 backdrop-blur-sm animate-fade-in delay-1000">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground flex items-center justify-center gap-2 font-mono tracking-wide">
            Made with <Heart className="h-5 w-5 text-destructive fill-destructive animate-pulse" /> by{" "}
            <span className="font-semibold text-primary neon-text">Hitesh Bhardwaj</span>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2 font-mono">
            [ SYSTEM VERSION 1.0.0 // {new Date().getFullYear()} ]
          </p>
        </div>
      </footer>
    </div>
  )
}
