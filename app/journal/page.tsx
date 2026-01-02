"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood?: string
  createdAt: number
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const stored = localStorage.getItem("journal-entries")
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  const saveToStorage = (updatedEntries: JournalEntry[]) => {
    localStorage.setItem("journal-entries", JSON.stringify(updatedEntries))
    setEntries(updatedEntries)
  }

  const addEntry = () => {
    if (formData.title && formData.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        ...formData,
        createdAt: Date.now(),
      }
      const updated = [entry, ...entries]
      saveToStorage(updated)
      resetForm()
      setIsAdding(false)
    }
  }

  const updateEntry = () => {
    if (editingId && formData.title && formData.content) {
      const updated = entries.map((e) =>
        e.id === editingId
          ? {
              ...e,
              title: formData.title,
              content: formData.content,
              mood: formData.mood,
              date: formData.date,
            }
          : e,
      )
      saveToStorage(updated)
      resetForm()
      setEditingId(null)
    }
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    saveToStorage(updated)
  }

  const startEdit = (entry: JournalEntry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || "",
      date: entry.date,
    })
    setEditingId(entry.id)
    setIsAdding(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      mood: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const cancelEdit = () => {
    resetForm()
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Daily Journal</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Entry" : "New Journal Entry"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  placeholder="Enter a title for your entry"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mood (optional)</label>
                <Input
                  placeholder="How are you feeling?"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Content</label>
                <Textarea
                  placeholder="Write about your day..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={editingId ? updateEntry : addEntry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Save"}
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
          <Button onClick={() => setIsAdding(true)} className="mb-6 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No journal entries yet. Start writing your first entry!
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{entry.title}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        {entry.mood && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">{entry.mood}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(entry)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
