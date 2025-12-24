"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskCard } from "./task-card"
import { Plus } from "lucide-react"

export function TaskColumn({
  column,
  tasks,
  onTaskClick,
  onTaskMove,
  onCreateTask,
  team,
}: {
  column: any
  tasks: any[]
  onTaskClick: (task: any) => void
  onTaskMove: (taskId: string, newStatus: string) => void
  onCreateTask: () => void
  team: any
}) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
            {column.title}
            <span className="text-xs bg-muted px-2 py-1 rounded-full ml-auto">{tasks.length}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={(e) => {
              e.dataTransfer?.setData("taskId", task.id)
            }}
            team={team}
          />
        ))}
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={onCreateTask}>
          <Plus className="w-4 h-4 mr-2" />
          Add task
        </Button>
      </CardContent>
    </Card>
  )
}
