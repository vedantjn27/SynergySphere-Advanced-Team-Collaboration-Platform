"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Plus, FolderKanban } from "lucide-react"
import Link from "next/link"

interface Project {
  _id: string
  name: string
  description?: string
  status: string
  priority: string
  members: Array<{ user_id: string; role: string }>
  progress: {
    completion_percentage: number
    tasks_total: number
    tasks_completed: number
  }
  metadata: {
    start_date: string
    end_date?: string
    tags: string[]
  }
  created_at: string
}

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground"
      case "completed":
        return "bg-chart-1 text-white"
      case "archived":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Button asChild size="sm">
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderKanban className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          projects.slice(0, 5).map((project) => (
            <div key={project._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Link href={`/projects/${project._id}`} className="font-medium hover:text-primary transition-colors">
                    {project.name}
                  </Link>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.members.length} members
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress.completion_percentage}%</span>
                </div>
                <Progress value={project.progress.completion_percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {project.progress.tasks_completed} of {project.progress.tasks_total} tasks completed
                </div>
              </div>

              {project.metadata.tags.length > 0 && (
                <div className="flex gap-1 mt-3">
                  {project.metadata.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.metadata.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.metadata.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
