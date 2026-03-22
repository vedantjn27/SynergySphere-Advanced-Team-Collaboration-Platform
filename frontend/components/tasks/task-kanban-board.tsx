"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckSquare, Clock, AlertCircle, Calendar, User, FolderKanban } from "lucide-react"
import { apiService } from "@/lib/api"

interface TaskKanbanBoardProps {
  tasks: any[]
  onTaskClick: (task: any) => void
  onTaskUpdate: (task: any) => void
}

export function TaskKanbanBoard({ tasks, onTaskClick, onTaskUpdate }: TaskKanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<any>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-chart-1" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-secondary" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-chart-1/10 border-chart-1/20"
      case "in_progress":
        return "bg-secondary/10 border-secondary/20"
      case "pending":
        return "bg-muted/50 border-border"
      default:
        return "bg-muted/50 border-border"
    }
  }

  const groupedTasks = {
    pending: tasks.filter((task) => task.status === "pending"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  }

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (!draggedTask || draggedTask.status === newStatus) return

    try {
      await apiService.updateTask(draggedTask.id, { status: newStatus })
      onTaskUpdate({ ...draggedTask, status: newStatus })
    } catch (error) {
      console.error("Failed to update task status:", error)
    } finally {
      setDraggedTask(null)
    }
  }

  const statusConfig = {
    pending: {
      title: "Pending",
      icon: AlertCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
    in_progress: {
      title: "In Progress",
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    completed: {
      title: "Completed",
      icon: CheckSquare,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.entries(groupedTasks).map(([status, statusTasks]) => {
        const config = statusConfig[status as keyof typeof statusConfig]
        return (
          <Card key={status} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                </div>
                {config.title}
                <Badge variant="outline" className="ml-auto">
                  {statusTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent
              className="space-y-3 min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {statusTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderKanban className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                statusTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className={`border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColor(
                      task.status,
                    )} ${draggedTask?.id === task.id ? "opacity-50" : ""}`}
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="space-y-3">
                      {/* Task Title */}
                      <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                      )}

                      {/* Project Badge */}
                      {task.project && (
                        <Badge variant="outline" className="text-xs">
                          {task.project.name}
                        </Badge>
                      )}

                      {/* Task Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.created_at).toLocaleDateString()}
                        </div>
                        {task.assignee_id && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs">
                                {task.assignee_id.slice(-2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            task.status === "completed"
                              ? "bg-chart-1 text-white"
                              : task.status === "in_progress"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status.replace("_", " ")}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
