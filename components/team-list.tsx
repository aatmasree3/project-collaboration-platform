"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Plus } from "lucide-react"

export function TeamList({
  teams,
  selectedTeam,
  onTeamCreated,
  onTeamSelected,
  currentUser,
}: {
  teams: any[]
  selectedTeam: any
  onTeamCreated: (team: any) => void
  onTeamSelected: (team: any) => void
  currentUser: any
}) {
  const [open, setOpen] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")

  const handleCreateTeam = () => {
    if (!teamName.trim()) return

    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      description: teamDescription,
      createdBy: currentUser.id,
      members: [{ id: currentUser.id, name: currentUser.name, email: currentUser.email, role: "admin" }],
      projects: [],
      createdAt: new Date().toISOString(),
    }

    onTeamCreated(newTeam)
    setTeamName("")
    setTeamDescription("")
    setOpen(false)
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Teams</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    placeholder="e.g. Design Team"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamDesc">Description</Label>
                  <Input
                    id="teamDesc"
                    placeholder="What is this team working on?"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateTeam} className="w-full">
                  Create Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {teams.length === 0 ? (
          <p className="text-sm text-muted-foreground">No teams yet</p>
        ) : (
          teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onTeamSelected(team)}
              className={`w-full flex items-center gap-2 p-3 rounded-lg text-left transition-colors ${
                selectedTeam?.id === team.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Users className="w-4 h-4" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{team.name}</p>
                <p className="text-xs opacity-70">{team.members.length} members</p>
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  )
}
