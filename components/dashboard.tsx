"use client"

import { useState, useEffect } from "react"
import { TeamList } from "./team-list"
import { ProjectBoard } from "./project-board"
import { Analytics } from "./analytics"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"

export function Dashboard({ currentUser, onLogout }: { currentUser: any; onLogout: () => void }) {
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("projects")

  useEffect(() => {
    // Load teams from localStorage
    const stored = localStorage.getItem("collaboration_teams")
    if (stored) {
      const loadedTeams = JSON.parse(stored)
      setTeams(loadedTeams)
      if (loadedTeams.length > 0) {
        setSelectedTeam(loadedTeams[0])
      }
    }
  }, [])

  const handleTeamCreated = (team: any) => {
    const updatedTeams = [...teams, team]
    setTeams(updatedTeams)
    localStorage.setItem("collaboration_teams", JSON.stringify(updatedTeams))
    setSelectedTeam(team)
  }

  const handleTeamSelected = (team: any) => {
    setSelectedTeam(team)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Project Collaboration</h1>
            <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TeamList
              teams={teams}
              selectedTeam={selectedTeam}
              onTeamCreated={handleTeamCreated}
              onTeamSelected={handleTeamSelected}
              currentUser={currentUser}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {selectedTeam ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="projects">
                  <ProjectBoard team={selectedTeam} currentUser={currentUser} />
                </TabsContent>
                <TabsContent value="analytics">
                  <Analytics team={selectedTeam} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-96 border border-dashed rounded-lg">
                <p className="text-muted-foreground">Create a team to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
