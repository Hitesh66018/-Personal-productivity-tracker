"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Flame, Target } from "lucide-react"

interface Habit {
  id: string
  name: string
  description: string
  goal: string
  completedDates: string[]
  createdAt: number
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "daily",
  })

  useEffect(() => {
    const stored = localStorage.getItem("habits")
    if (stored) {
      setHabits(JSON.parse(stored))
    }
  }, [])

  const saveToStorage = (updatedHabits: Habit[]) => {
    localStorage.setItem("habits", JSON.stringify(updatedHabits))
    setHabits(updatedHabits)
  }

  const addHabit = () => {
    if (formData.name) {
      const habit: Habit = {
        id: Date.now().toString(),
        ...formData,
        completedDates: [],
        createdAt: Date.now(),
      }
      const updated = [...habits, habit]
      saveToStorage(updated)
      resetForm()
      setIsAdding(false)
    }
  }

  const updateHabit = () => {
    if (editingId && formData.name) {
      const updated = habits.map((h) =>
        h.id === editingId
          ? {
              ...h,
              name: formData.name,
              description: formData.description,
              goal: formData.goal,
            }
          : h,
      )
      saveToStorage(updated)
      resetForm()
      setEditingId(null)
    }
  }

  const deleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id)
    saveToStorage(updated)
  }

  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split("T")[0]
    const updated = habits.map((h) => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(today)
        return {
          ...h,
          completedDates: isCompleted
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today].sort(),
        }
      }
      return h
    })
    saveToStorage(updated)
  }

  const startEdit = (habit: Habit) => {
    setFormData({
      name: habit.name,
      description: habit.description,
      goal: habit.goal,
    })
    setEditingId(habit.id)
    setIsAdding(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      goal: "daily",
    })
  }

  const cancelEdit = () => {
    resetForm()
    setIsAdding(false)
    setEditingId(null)
  }

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0

    const sorted = [...completedDates].sort().reverse()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = 0
    let currentDate = new Date(today)

    for (const dateStr of sorted) {
      const completedDate = new Date(dateStr)
      completedDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0 || diffDays === 1) {
        streak++
        currentDate = new Date(completedDate)
      } else {
        break
      }
    }

    return streak
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split("T")[0])
    }
    return days
  }

  const last7Days = getLast7Days()
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold">{habits.length}</div>
                  <div className="text-sm text-muted-foreground">Active Habits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {Math.max(...habits.map((h) => calculateStreak(h.completedDates)), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <div className="text-2xl font-bold">
                  {habits.filter((h) => h.completedDates.includes(today)).length}
                </div>
                <div className="text-sm text-muted-foreground">Completed Today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="mb-6 border-2 border-amber-200">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Habit" : "New Habit"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Habit Name</label>
                <Input
                  placeholder="e.g., Morning exercise, Read 30 minutes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                <Input
                  placeholder="Why is this habit important?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Goal</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingId ? updateHabit : addHabit} className="flex-1 bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Add Habit"}
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
          <Button onClick={() => setIsAdding(true)} className="mb-6 bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            New Habit
          </Button>
        )}

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No habits yet. Start building better habits today!
              </CardContent>
            </Card>
          ) : (
            habits.map((habit) => {
              const streak = calculateStreak(habit.completedDates)
              const isCompletedToday = habit.completedDates.includes(today)

              return (
                <Card key={habit.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle className="text-xl">{habit.name}</CardTitle>
                          {streak > 0 && (
                            <div className="flex items-center gap-1 text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-sm font-medium">
                              <Flame className="h-4 w-4" />
                              {streak} day{streak !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                        {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
                        <p className="text-xs text-muted-foreground mt-1">Goal: {habit.goal}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(habit)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Week View */}
                      <div className="flex gap-1 justify-between">
                        {last7Days.map((date) => {
                          const isCompleted = habit.completedDates.includes(date)
                          const dateObj = new Date(date)
                          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" })

                          return (
                            <div key={date} className="flex flex-col items-center gap-1">
                              <span className="text-xs text-muted-foreground">{dayName}</span>
                              <button
                                onClick={() => date === today && toggleHabitToday(habit.id)}
                                disabled={date !== today}
                                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                  isCompleted
                                    ? "bg-amber-500 border-amber-600 text-white"
                                    : "bg-gray-50 border-gray-200 hover:border-amber-300"
                                } ${date === today && !isCompleted ? "cursor-pointer hover:bg-amber-50" : ""} ${date !== today ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {isCompleted && "✓"}
                              </button>
                            </div>
                          )
                        })}
                      </div>

                      {/* Toggle Today Button */}
                      <Button
                        onClick={() => toggleHabitToday(habit.id)}
                        variant={isCompletedToday ? "outline" : "default"}
                        className={`w-full ${isCompletedToday ? "bg-white" : "bg-amber-600 hover:bg-amber-700"}`}
                      >
                        {isCompletedToday ? "Mark as Incomplete" : "Complete Today"}
                      </Button>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                        <span>Total completions: {habit.completedDates.length}</span>
                        <span>Current streak: {streak} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
