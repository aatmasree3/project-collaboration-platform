"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, User } from "lucide-react"

export function TaskCard({
  task,
  onClick,
  onDragStart,
  team,
}: {
  task: any
  onClick: () => void
  onDragStart?: (e: React.DragEvent) => void
  team: any
}) {
  const assignee = task.assignedTo ? team.members.find((m: any) => m.id === task.assignedTo) : null

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done"

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow p-3 space-y-2"
    >
      <p className="text-sm font-medium line-clamp-2">{task.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={`text-xs ${
            task.priority === "high"
              ? "bg-red-50 text-red-700"
              : task.priority === "medium"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
          }`}
        >
          {task.priority}
        </Badge>
      </div>
      {assignee && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          {assignee.name}
        </div>
      )}
      {task.deadline && (
        <div className={`flex items-center gap-2 text-xs ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
          <CalendarIcon className="w-3 h-3" />
          {new Date(task.deadline).toLocaleDateString()}
        </div>
      )}
    </Card>
  )
}
