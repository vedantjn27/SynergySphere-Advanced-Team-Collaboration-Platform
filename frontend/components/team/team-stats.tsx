"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderKanban, CheckSquare, TrendingUp } from "lucide-react"

interface TeamStatsProps {
  projects: any[]
  members: any[]
}

export function TeamStats({ projects, members }: TeamStatsProps) {
  const totalTasks = projects.reduce((acc, project) => acc + (project.progress?.tasks_total || 0), 0)

  const completedTasks = projects.reduce((acc, project) => acc + (project.progress?.tasks_completed || 0), 0)

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const activeProjects = projects.filter((project) => project.status === "active").length

  const stats = [
    {
      title: "Team Members",
      value: members.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: FolderKanban,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: CheckSquare,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
