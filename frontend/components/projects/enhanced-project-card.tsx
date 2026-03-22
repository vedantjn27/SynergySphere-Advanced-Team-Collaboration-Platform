"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MoreHorizontal, Eye, Star, Zap, Target, TrendingUp } from "lucide-react"
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

export function EnhancedProjectCard({ project }: ProjectCardProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          color: "bg-red-500/10 text-red-600 border-red-200",
          icon: Zap,
          gradient: "from-red-500/20 to-orange-500/20",
        }
      case "medium":
        return {
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
          icon: Target,
          gradient: "from-yellow-500/20 to-amber-500/20",
        }
      case "low":
        return {
          color: "bg-green-500/10 text-green-600 border-green-200",
          icon: TrendingUp,
          gradient: "from-green-500/20 to-emerald-500/20",
        }
      default:
        return {
          color: "bg-gray-500/10 text-gray-600 border-gray-200",
          icon: Target,
          gradient: "from-gray-500/20 to-slate-500/20",
        }
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "gradient-primary text-white",
          pulse: true,
        }
      case "completed":
        return {
          color: "bg-emerald-500 text-white",
          pulse: false,
        }
      case "archived":
        return {
          color: "bg-gray-400 text-white",
          pulse: false,
        }
      default:
        return {
          color: "bg-gray-400 text-white",
          pulse: false,
        }
    }
  }

  const priorityConfig = getPriorityConfig(project.priority)
  const statusConfig = getStatusConfig(project.status)

  return (
    <Card className="hover-lift transition-theme gradient-card border-0 shadow-lg group animate-fade-in overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${priorityConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
                <priorityConfig.icon className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                <Link href={`/projects/${project._id}`}>{project.name}</Link>
              </CardTitle>
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift">
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
          <Badge className={`${priorityConfig.color} hover-lift`}>
            <priorityConfig.icon className="mr-1 h-3 w-3" />
            {project.priority}
          </Badge>
          <Badge className={`${statusConfig.color} ${statusConfig.pulse ? "animate-pulse-subtle" : ""}`}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="space-y-3 p-3 rounded-lg bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-lg">{project.progress.completion_percentage}%</span>
            </div>
          </div>
          <Progress value={project.progress.completion_percentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{project.progress.tasks_completed} completed</span>
            <span>{project.progress.tasks_total} total tasks</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm font-medium">{project.members.length} team members</span>
          </div>
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member, index) => (
              <Avatar
                key={member.user_id}
                className="h-7 w-7 border-2 border-background shadow-sm hover-lift"
                style={{ zIndex: 10 - index }}
              >
                <AvatarFallback className="text-xs gradient-primary text-white">
                  {member.user_id.slice(-2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 4 && (
              <div className="h-7 w-7 rounded-full gradient-secondary border-2 border-background flex items-center justify-center shadow-sm">
                <span className="text-xs text-white font-medium">+{project.members.length - 4}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
          <Button variant="ghost" size="sm" className="hover-lift" asChild>
            <Link href={`/projects/${project._id}`}>
              <Eye className="mr-1 h-3 w-3" />
              View
            </Link>
          </Button>
        </div>

        {project.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.metadata.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                #{tag}
              </Badge>
            ))}
            {project.metadata.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                +{project.metadata.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
