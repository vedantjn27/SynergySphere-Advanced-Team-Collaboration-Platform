"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { WelcomeHero } from "@/components/dashboard/welcome-hero"
import { EnhancedStatsCards } from "@/components/dashboard/enhanced-stats-cards"
import { ProductivityChart } from "@/components/dashboard/productivity-chart"
import { EnhancedRecentProjects } from "@/components/dashboard/enhanced-recent-projects"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { TeamInsights } from "@/components/dashboard/team-insights"
import { CalendarView } from "@/components/calendar/calendar-view"
import { Sidebar } from "@/components/layout/sidebar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BarChart3, Users, Sparkles, Zap } from "lucide-react"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const projectsData = await apiService.getProjects()
        setProjects(projectsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data")
        console.error("Dashboard data fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <LoadingSpinner size="lg" text="Loading your personalized workspace..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="max-w-md mx-auto gradient-card border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="gradient-primary hover-lift shadow-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate stats from projects data
  const stats = {
    totalProjects: projects.length,
    activeTasks: projects.reduce(
      (acc: number, project: any) => acc + (project.progress?.tasks_total - project.progress?.tasks_completed || 0),
      0,
    ),
    teamMembers: new Set(
      projects.flatMap((project: any) => project.members?.map((member: any) => member.user_id) || []),
    ).size,
    completionRate:
      projects.length > 0
        ? Math.round(
            projects.reduce((acc: number, project: any) => acc + (project.progress?.completion_percentage || 0), 0) /
              projects.length,
          )
        : 0,
  }

  // Check if user is new (has no projects)
  const isNewUser = projects.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />

      <div className="md:ml-64">
        <div className="p-6 space-y-8">
          <div className="animate-slide-in-up">
            <WelcomeHero userName={user?.username || "User"} isNewUser={isNewUser} />
          </div>

          {/* Enhanced Stats Cards */}
          <EnhancedStatsCards stats={stats} />

          {/* Productivity Charts */}
          <ProductivityChart />

          {/* Main content grid with better spacing */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Recent Projects - Takes 8 columns */}
            <div className="lg:col-span-8 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <EnhancedRecentProjects projects={projects} />
            </div>

            {/* Team Insights - Takes 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              <div className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
                <TeamInsights />
              </div>
              <div className="animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
                <RecentActivity activities={[]} />
              </div>
            </div>
          </div>

          {/* Calendar and quick actions section */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
              <CalendarView />
            </div>

            {/* Enhanced Quick Actions */}
            <Card
              className="hover-lift transition-theme gradient-card border-0 shadow-lg animate-slide-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2 hover-lift gradient-card bg-transparent">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="font-medium">Invite Team Members</span>
                    <span className="text-xs text-muted-foreground">Add collaborators to your projects</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 hover-lift gradient-card bg-transparent">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                    <span className="font-medium">View Detailed Reports</span>
                    <span className="text-xs text-muted-foreground">Analyze team performance metrics</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 hover-lift gradient-card bg-transparent">
                    <Calendar className="h-6 w-6 text-chart-3" />
                    <span className="font-medium">Schedule Team Meeting</span>
                    <span className="text-xs text-muted-foreground">Coordinate with your team</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
