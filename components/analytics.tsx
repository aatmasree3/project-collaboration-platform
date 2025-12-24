"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export function Analytics({ team }: { team: any }) {
  const [projects, setProjects] = useState<any[]>([])
  const [taskStats, setTaskStats] = useState<any>(null)
  const [projectProgress, setProjectProgress] = useState<any[]>([])

  useEffect(() => {
    // Load all projects for this team
    const teamProjects: any[] = []
    const projectKeys = Object.keys(localStorage).filter((key) => key.startsWith("projects_"))

    projectKeys.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "[]")
      const filteredProjects = data.filter((p: any) => p.teamId === team.id)
      teamProjects.push(...filteredProjects)
    })

    setProjects(teamProjects)

    // Calculate statistics
    let allTasks: any[] = []
    teamProjects.forEach((project) => {
      const tasks = JSON.parse(localStorage.getItem(`tasks_${project.id}`) || "[]")
      allTasks = allTasks.concat(tasks)
    })

    const stats = {
      total: allTasks.length,
      todo: allTasks.filter((t) => t.status === "todo").length,
      inProgress: allTasks.filter((t) => t.status === "in-progress").length,
      done: allTasks.filter((t) => t.status === "done").length,
    }

    setTaskStats(stats)

    // Calculate progress data
    const progressData = teamProjects.map((project) => {
      const projectTasks = allTasks.filter((t) => t.projectId === project.id)
      const completedTasks = projectTasks.filter((t) => t.status === "done").length
      const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0

      return {
        name: project.name,
        completed: completedTasks,
        total: projectTasks.length,
        progress: Math.round(progress),
      }
    })

    setProjectProgress(progressData)
  }, [team.id])

  if (!taskStats) {
    return <div>Loading analytics...</div>
  }

  const statusData = [
    { name: "To-Do", value: taskStats.todo },
    { name: "In Progress", value: taskStats.inProgress },
    { name: "Done", value: taskStats.done },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">To-Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{taskStats.todo}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((taskStats.todo / taskStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((taskStats.inProgress / taskStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((taskStats.done / taskStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Overview of all tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Completion rate by project</CardDescription>
          </CardHeader>
          <CardContent>
            {projectProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectProgress} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#3b82f6" name="Progress %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">No projects yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      {projectProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectProgress.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project.completed}/{project.total}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">{project.progress}% complete</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
