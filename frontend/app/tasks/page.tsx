"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Sidebar } from "@/components/layout/sidebar"
import { TaskKanbanBoard } from "@/components/tasks/task-kanban-board"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskDetailModal } from "@/components/tasks/task-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search } from "lucide-react"

export default function TasksPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [allTasks, setAllTasks] = useState<any[]>([])
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  useEffect(() => {
    const fetchTasksData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const projectsData :any= await apiService.getProjects()
        setProjects(projectsData)

        // Fetch tasks for all projects
        const tasksPromises = projectsData.map((project: any) =>
          apiService.getProjectTasks(project._id).then((tasks) => tasks.map((task) => ({ ...task, project }))),
        )

        const tasksArrays :any= await Promise.all(tasksPromises)
        const tasks = tasksArrays.flat()

        setAllTasks(tasks)
        setFilteredTasks(tasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks")
        console.error("Tasks fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasksData()
  }, [user])

  useEffect(() => {
    let filtered = allTasks

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task: any) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task: any) => task.status === statusFilter)
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter((task: any) => task.project._id === projectFilter)
    }

    setFilteredTasks(filtered)
  }, [allTasks, searchQuery, statusFilter, projectFilter])

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleTaskUpdate = (updatedTask: any) => {
    setAllTasks((tasks) => tasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading tasks...</p>
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
            <p className="text-destructive mb-4">Error loading tasks: {error}</p>
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </div>
        </div>
      </div>
    )
  }

  const myTasks = filteredTasks.filter((task: any) => task.assignee_id === user?.id || task.creator_id === user?.id)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="md:ml-64">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground mt-1">Manage and track your tasks across all projects</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <TaskFilters
              statusFilter={statusFilter}
              projectFilter={projectFilter}
              projects={projects}
              onStatusChange={setStatusFilter}
              onProjectChange={setProjectFilter}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="kanban" className="space-y-6">
            <TabsList>
              <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
              <TabsTrigger value="my-tasks">My Tasks ({myTasks.length})</TabsTrigger>
              <TabsTrigger value="all-tasks">All Tasks ({filteredTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="kanban">
              <TaskKanbanBoard tasks={filteredTasks} onTaskClick={handleTaskClick} onTaskUpdate={handleTaskUpdate} />
            </TabsContent>

            <TabsContent value="my-tasks">
              <TaskKanbanBoard tasks={myTasks} onTaskClick={handleTaskClick} onTaskUpdate={handleTaskUpdate} />
            </TabsContent>

            <TabsContent value="all-tasks">
              <TaskKanbanBoard tasks={filteredTasks} onTaskClick={handleTaskClick} onTaskUpdate={handleTaskUpdate} />
            </TabsContent>
          </Tabs>

          {/* Task Detail Modal */}
          <TaskDetailModal
            task={selectedTask}
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onUpdate={handleTaskUpdate}
          />
        </div>
      </div>
    </div>
  )
}
