"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Clock, BookOpen } from "lucide-react"

interface StudySession {
  id: string
  date: string
  subject: string
  topic: string
  duration: number
  resources: string
  notes: string
  createdAt: number
}

export default function StudyPage() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    subject: "",
    topic: "",
    duration: "",
    resources: "",
    notes: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("study-sessions")
    if (stored) {
      setSessions(JSON.parse(stored))
    }
  }, [])

  const saveToStorage = (updatedSessions: StudySession[]) => {
    localStorage.setItem("study-sessions", JSON.stringify(updatedSessions))
    setSessions(updatedSessions)
  }

  const addSession = () => {
    if (formData.subject && formData.topic && formData.duration) {
      const session: StudySession = {
        id: Date.now().toString(),
        ...formData,
        duration: Number.parseInt(formData.duration),
        createdAt: Date.now(),
      }
      const updated = [session, ...sessions]
      saveToStorage(updated)
      resetForm()
      setIsAdding(false)
    }
  }

  const updateSession = () => {
    if (editingId && formData.subject && formData.topic && formData.duration) {
      const updated = sessions.map((s) =>
        s.id === editingId
          ? {
              ...s,
              ...formData,
              duration: Number.parseInt(formData.duration),
            }
          : s,
      )
      saveToStorage(updated)
      resetForm()
      setEditingId(null)
    }
  }

  const deleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id)
    saveToStorage(updated)
  }

  const startEdit = (session: StudySession) => {
    setFormData({
      date: session.date,
      subject: session.subject,
      topic: session.topic,
      duration: session.duration.toString(),
      resources: session.resources,
      notes: session.notes,
    })
    setEditingId(session.id)
    setIsAdding(false)
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      subject: "",
      topic: "",
      duration: "",
      resources: "",
      notes: "",
    })
  }

  const cancelEdit = () => {
    resetForm()
    setIsAdding(false)
    setEditingId(null)
  }

  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0)
  const subjectBreakdown = sessions.reduce(
    (acc, s) => {
      acc[s.subject] = (acc[s.subject] || 0) + s.duration
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Study Tracker</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{totalHours}</div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <div className="text-sm text-muted-foreground">Study Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <div className="text-2xl font-bold">{Object.keys(subjectBreakdown).length}</div>
                <div className="text-sm text-muted-foreground">Subjects Studied</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Breakdown */}
        {Object.keys(subjectBreakdown).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Time by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(subjectBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([subject, hours]) => (
                    <div key={subject} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{subject}</span>
                      <span className="text-sm text-muted-foreground">{hours} hours</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="mb-6 border-2 border-purple-200">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Study Session" : "New Study Session"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duration (hours)</label>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="2.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  placeholder="e.g., Mathematics, Physics, Programming"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Topic</label>
                <Input
                  placeholder="What did you study?"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Resources Used (optional)</label>
                <Input
                  placeholder="Books, videos, websites, etc."
                  value={formData.resources}
                  onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
                <Textarea
                  placeholder="Key takeaways, things to review..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingId ? updateSession : addSession}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Save Session"}
                </Button>
                <Button variant="outline" onClick={cancelEdit} className="flex-1 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="mb-6 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Study Session
          </Button>
        )}

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No study sessions recorded yet. Start tracking your learning!
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <CardTitle className="text-xl">{session.subject}</CardTitle>
                        <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-medium">
                          {session.duration}h
                        </span>
                      </div>
                      <p className="text-muted-foreground">{session.topic}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(session)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {session.resources && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Resources:</p>
                      <p className="text-sm text-muted-foreground">{session.resources}</p>
                    </div>
                  )}
                  {session.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
