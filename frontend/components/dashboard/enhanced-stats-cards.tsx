"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, CheckCircle, Clock, Target } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalProjects: number
    activeTasks: number
    teamMembers: number
    completionRate: number
  }
}

export function EnhancedStatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: Target,
      description: "Active projects",
      trend: "+12%",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      icon: Clock,
      description: "Pending completion",
      trend: "-8%",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: Users,
      description: "Collaborating",
      trend: "+3%",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      description: "Overall progress",
      trend: "+15%",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="hover-lift transition-theme animate-slide-in-up gradient-card border-0 shadow-lg"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">{card.trend}</span>
              </div>
            </div>
            {card.title === "Completion Rate" && <Progress value={stats.completionRate} className="mt-3 h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
