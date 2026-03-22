"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Sidebar } from "@/components/layout/sidebar"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectTasks } from "@/components/projects/project-tasks"
import { ProjectMembers } from "@/components/projects/project-members"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const projectId = params.id as string

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!user || !projectId) return

      try {
        setLoading(true)
        const [projectData, tasksData] = await Promise.all([
          apiService.getProject(projectId),
          apiService.getProjectTasks(projectId),
        ])
        setProject(projectData)
        setTasks(tasksData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project")
        console.error("Project fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [user, projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading project: {error}</p>
            <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Project not found</p>
            <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="md:ml-64">
        <div className="p-6 space-y-6">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          {/* Project Header */}
          <ProjectHeader project={project} />

          {/* Tabs */}
          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="members">Team Members</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <ProjectTasks projectId={projectId} tasks={tasks} setTasks={setTasks} />
            </TabsContent>

            <TabsContent value="members">
              <ProjectMembers project={project} setProject={setProject} />
            </TabsContent>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Description:</span>
                      <p className="text-sm">{project.description || "No description provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Created:</span>
                      <p className="text-sm">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Start Date:</span>
                      <p className="text-sm">
                        {project.metadata?.start_date
                          ? new Date(project.metadata.start_date).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">End Date:</span>
                      <p className="text-sm">
                        {project.metadata?.end_date
                          ? new Date(project.metadata.end_date).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
