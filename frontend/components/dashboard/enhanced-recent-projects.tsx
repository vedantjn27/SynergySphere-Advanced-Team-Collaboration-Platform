"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedProjectCard } from "@/components/projects/enhanced-project-card"
import { Plus, FolderKanban, Sparkles, Grid3X3, List } from "lucide-react"
import { useState } from "react"
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

interface EnhancedRecentProjectsProps {
  projects: Project[]
}

export function EnhancedRecentProjects({ projects }: EnhancedRecentProjectsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <Card className="hover-lift transition-theme gradient-card border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          Recent Projects
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("list")}
            >
              <List className="h-3 w-3" />
            </Button>
          </div>
          <Button asChild size="sm" className="gradient-primary hover-lift shadow-lg">
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
              <FolderKanban className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to get started with team collaboration!
            </p>
            <Button asChild className="gradient-primary hover-lift">
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2" : "space-y-4"}>
            {projects.slice(0, 6).map((project, index) => (
              <div key={project._id} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {viewMode === "grid" ? (
                  <EnhancedProjectCard project={project} />
                ) : (
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors hover-lift">
                    {/* List view content - simplified version */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/projects/${project._id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {project.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{project.progress.completion_percentage}%</div>
                        <div className="text-xs text-muted-foreground">{project.members.length} members</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 6 && (
          <div className="text-center mt-6">
            <Button variant="outline" asChild className="hover-lift bg-transparent">
              <Link href="/projects">View All {projects.length} Projects</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
