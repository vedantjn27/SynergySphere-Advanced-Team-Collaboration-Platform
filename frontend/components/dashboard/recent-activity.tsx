"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, MessageSquare, UserPlus, FolderPlus } from "lucide-react"

interface ActivityItem {
  id: string
  type: "task_completed" | "comment_added" | "member_added" | "project_created"
  user: string
  description: string
  timestamp: string
  project?: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckSquare className="h-4 w-4 text-chart-1" />
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-primary" />
      case "member_added":
        return <UserPlus className="h-4 w-4 text-secondary" />
      case "project_created":
        return <FolderPlus className="h-4 w-4 text-accent" />
      default:
        return <CheckSquare className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "task_completed":
        return "bg-chart-1/10"
      case "comment_added":
        return "bg-primary/10"
      case "member_added":
        return "bg-secondary/10"
      case "project_created":
        return "bg-accent/10"
      default:
        return "bg-muted"
    }
  }

  // Mock data for demonstration since we don't have activity tracking in the backend yet
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "task_completed",
      user: "John Doe",
      description: "completed task 'Setup authentication system'",
      timestamp: "2 hours ago",
      project: "SynergySphere Frontend",
    },
    {
      id: "2",
      type: "comment_added",
      user: "Jane Smith",
      description: "added a comment on 'Dashboard design'",
      timestamp: "4 hours ago",
      project: "SynergySphere Frontend",
    },
    {
      id: "3",
      type: "member_added",
      user: "Mike Johnson",
      description: "joined the project team",
      timestamp: "1 day ago",
      project: "Mobile App Development",
    },
    {
      id: "4",
      type: "project_created",
      user: "Sarah Wilson",
      description: "created new project 'Marketing Campaign'",
      timestamp: "2 days ago",
    },
  ]

  const displayActivities = activities.length > 0 ? activities : mockActivities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayActivities.slice(0, 8).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{activity.user}</span>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              {activity.project && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {activity.project}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
