"use client"

import { useState, useEffect } from "react"
import { TaskBoard } from "./task-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

export function ProjectBoard({ team, currentUser }: { team: any; currentUser: any }) {
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    // Load projects from localStorage
    const stored = localStorage.getItem(`projects_${team.id}`)
    if (stored) {
      const loadedProjects = JSON.parse(stored)
      setProjects(loadedProjects)
      if (loadedProjects.length > 0) {
        setSelectedProject(loadedProjects[0])
      }
    }
  }, [team.id])

  const handleCreateProject = () => {
    if (!projectName.trim()) return

    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      teamId: team.id,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      tasks: [],
    }

    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    localStorage.setItem(`projects_${team.id}`, JSON.stringify(updatedProjects))
    setSelectedProject(newProject)
    setProjectName("")
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{team.name}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g. Website Redesign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No projects yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 pb-2 border-b overflow-x-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedProject?.id === project.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
          {selectedProject && <TaskBoard project={selectedProject} team={team} currentUser={currentUser} />}
        </div>
      )}
    </div>
  )
}
