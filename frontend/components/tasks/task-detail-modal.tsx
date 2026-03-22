"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, User, MessageSquare, Send, Loader2 } from "lucide-react"

interface TaskDetailModalProps {
  task: any
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: any) => void
}

export function TaskDetailModal({ task, isOpen, onClose, onUpdate }: TaskDetailModalProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    status: "",
  })

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
      })
      fetchComments()
    }
  }, [task])

  const fetchComments = async () => {
    if (!task?.id) return
    try {
      const commentsData:any = await apiService.getTaskComments(task.id)
      setComments(commentsData)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  const handleSave = async () => {
    if (!task || !user) return

    setLoading(true)
    try {
      const updatedTask:any = await apiService.updateTask(task.id, editedTask)
      onUpdate({ ...task, ...updatedTask })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !task || !user) return

    setLoading(true)
    try {
      const comment = await apiService.addTaskComment(task.id, {
        author_id: user.id,
        content: newComment.trim(),
      })
      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTask = async (assigneeId: string) => {
    if (!task || !user) return

    try {
      await apiService.assignTask(task.id, assigneeId)
      onUpdate({ ...task, assignee_id: assigneeId })
    } catch (error) {
      console.error("Failed to assign task:", error)
    }
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-lg font-semibold"
                />
              ) : (
                <DialogTitle className="text-xl">{task.title}</DialogTitle>
              )}
              <DialogDescription className="mt-2">Project: {task.project?.name || "Unknown Project"}</DialogDescription>
            </div>
            <div className="flex gap-2 ml-4">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Task Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedTask.status}
                      onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={`mt-1 ${
                        task.status === "completed"
                          ? "bg-chart-1 text-white"
                          : task.status === "in_progress"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm mt-1">{task.description || "No description provided"}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Assignee</Label>
                <div className="flex items-center gap-2 mt-1">
                  {task.assignee_id ? (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{task.assignee_id.slice(-2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Assigned to {task.assignee_id.slice(-8)}</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignTask(user?.id || "")}
                        disabled={!user}
                      >
                        Assign to me
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Comments ({comments.length})</h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={loading}
                  />
                  <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{comment.author_id.slice(-2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">User {comment.author_id.slice(-8)}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
