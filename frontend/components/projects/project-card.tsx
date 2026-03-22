"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ProjectCardProps {
  project: {
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
}

export function ProjectCard({ project }: ProjectCardProps) {
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
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              <Link href={`/projects/${project._id}`}>{project.name}</Link>
            </CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project._id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 mt-3">
          <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress.completion_percentage}%</span>
          </div>
          <Progress value={project.progress.completion_percentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {project.progress.tasks_completed} of {project.progress.tasks_total} tasks completed
          </div>
        </div>

        {/* Team Members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{project.members.length} members</span>
          </div>
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, index) => (
              <Avatar key={member.user_id} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs">{member.user_id.slice(-2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{project.members.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Created {new Date(project.created_at).toLocaleDateString()}
        </div>

        {/* Tags */}
        {project.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
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
      </CardContent>
    </Card>
  )
}
