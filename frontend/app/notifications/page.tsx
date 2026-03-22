"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Sidebar } from "@/components/layout/sidebar"
import { NotificationItem } from "@/components/notifications/notification-item"
import { NotificationFilters } from "@/components/notifications/notification-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Bell, CheckCheck } from "lucide-react"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        setLoading(true)
        const notificationsData = await apiService.getNotifications()
        setNotifications(notificationsData)
        setFilteredNotifications(notificationsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notifications")
        console.error("Notifications fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  useEffect(() => {
    let filtered = notifications

    if (filter === "unread") {
      filtered = notifications.filter((notification: any) => !notification.read)
    } else if (filter === "read") {
      filtered = notifications.filter((notification: any) => notification.read)
    }

    setFilteredNotifications(filtered)
  }, [notifications, filter])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId)
      setNotifications(
        notifications.map((notification: any) =>
          notification._id === notificationId
            ? { ...notification, read: true, read_at: new Date().toISOString() }
            : notification,
        ),
      )
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await apiService.deleteNotification(notificationId)
      setNotifications(notifications.filter((notification: any) => notification._id !== notificationId))
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notification: any) => !notification.read)

    try {
      await Promise.all(
        unreadNotifications.map((notification: any) => apiService.markNotificationAsRead(notification._id)),
      )

      setNotifications(
        notifications.map((notification: any) => ({
          ...notification,
          read: true,
          read_at: new Date().toISOString(),
        })),
      )
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const unreadCount = notifications.filter((notification: any) => !notification.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading notifications...</p>
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
            <p className="text-destructive mb-4">Error loading notifications: {error}</p>
            <Button onClick={() => window.location.reload()}>Try again</Button>
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground mt-1">Stay updated with your team activities and project changes</p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark All Read ({unreadCount})
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <NotificationFilters filter={filter} onFilterChange={setFilter} />

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {filter === "all" && `All Notifications (${filteredNotifications.length})`}
                {filter === "unread" && `Unread Notifications (${filteredNotifications.length})`}
                {filter === "read" && `Read Notifications (${filteredNotifications.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {filter === "unread"
                      ? "No unread notifications"
                      : filter === "read"
                        ? "No read notifications"
                        : "No notifications yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === "unread"
                      ? "You're all caught up!"
                      : filter === "read"
                        ? "No notifications have been read yet"
                        : "You'll see notifications here when there's activity on your projects"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map((notification: any) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
