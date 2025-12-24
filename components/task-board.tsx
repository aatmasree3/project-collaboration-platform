"use client"

import { useState, useEffect } from "react"
import { TaskColumn } from "./task-column"
import { TaskDetailDialog } from "./task-detail-dialog"

const COLUMNS = [
  { id: "todo", title: "To-Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

export function TaskBoard({ project, team, currentUser }: { project: any; team: any; currentUser: any }) {
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    // Load tasks from localStorage
    const stored = localStorage.getItem(`tasks_${project.id}`)
    if (stored) {
      setTasks(JSON.parse(stored))
    }
  }, [project.id])

  const updateTasks = (newTasks: any[]) => {
    setTasks(newTasks)
    localStorage.setItem(`tasks_${project.id}`, JSON.stringify(newTasks))
  }

  const handleCreateTask = (status: string) => {
    const newTask = {
      id: Date.now().toString(),
      title: "New Task",
      status,
      projectId: project.id,
      createdBy: currentUser.id,
      assignedTo: null,
      deadline: null,
      priority: "medium",
      description: "",
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [...tasks, newTask]
    updateTasks(updatedTasks)
    setSelectedTask(newTask)
    setShowDialog(true)
  }

  const handleTaskUpdate = (updatedTask: any) => {
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    updateTasks(updatedTasks)
    setSelectedTask(updatedTask)
  }

  const handleTaskMove = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    updateTasks(updatedTasks)
  }

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId)
    updateTasks(updatedTasks)
    setShowDialog(false)
    setSelectedTask(null)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasks.filter((t) => t.status === column.id)}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowDialog(true)
            }}
            onTaskMove={handleTaskMove}
            onCreateTask={() => handleCreateTask(column.id)}
            team={team}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={showDialog}
          onOpenChange={setShowDialog}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          team={team}
          allTasks={tasks}
        />
      )}
    </div>
  )
}
