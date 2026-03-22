"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Target } from "lucide-react"

interface ProjectHeaderProps {
  project: {
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
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
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
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Badges */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
              {project.description && <p className="text-muted-foreground">{project.description}</p>}
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-semibold">{project.progress.completion_percentage}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="font-semibold">{project.members.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks</p>
                <p className="font-semibold">
                  {project.progress.tasks_completed}/{project.progress.tasks_total}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{project.progress.completion_percentage}%</span>
            </div>
            <Progress value={project.progress.completion_percentage} className="h-3" />
          </div>

          {/* Tags */}
          {project.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.metadata.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
