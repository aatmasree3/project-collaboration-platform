"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { LoginForm } from "@/components/login-form"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const stored = localStorage.getItem("collaboration_user")
    if (stored) {
      const user = JSON.parse(stored)
      setCurrentUser(user)
      setIsLoggedIn(true)
    }
    setHydrated(true)
  }, [])

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem("collaboration_user", JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("collaboration_user")
  }

  if (!hydrated) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />
}
