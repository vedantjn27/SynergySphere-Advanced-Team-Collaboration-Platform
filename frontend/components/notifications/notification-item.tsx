"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, MessageSquare, UserPlus, FolderPlus, Bell, Check, Trash2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NotificationItemProps {
  notification: {
    _id: string
    user_id: string
    message: string
    read: boolean
    created_at: string
    read_at?: string
    type?: string
    title?: string
  }
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "task_assigned":
        return <CheckSquare className="h-4 w-4 text-primary" />
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-secondary" />
      case "member_added":
        return <UserPlus className="h-4 w-4 text-accent" />
      case "project_created":
        return <FolderPlus className="h-4 w-4 text-chart-1" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case "task_assigned":
        return "bg-primary/10"
      case "comment_added":
        return "bg-secondary/10"
      case "member_added":
        return "bg-accent/10"
      case "project_created":
        return "bg-chart-1/10"
      default:
        return "bg-muted/50"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown time"
    }
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        !notification.read ? "border-primary/20 bg-primary/5" : "border-border"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Notification Icon */}
          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>

          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {notification.title && <h4 className="font-medium text-sm mb-1">{notification.title}</h4>}
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!notification.read && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
            </div>

            {/* Notification Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(notification.created_at)}</span>
                {notification.read && notification.read_at && <span>• Read {formatTimeAgo(notification.read_at)}</span>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {!notification.read && (
                  <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification._id)} className="h-8 px-2">
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(notification._id)}
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
