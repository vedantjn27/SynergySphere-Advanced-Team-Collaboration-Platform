"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Trophy, Zap, Target, TrendingUp, Clock } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  tasksCompleted: number
  productivity: number
  avatar?: string
}

export function TeamInsights() {
  // Mock team data for demonstration
  const teamMembers: TeamMember[] = [
    { id: "1", name: "Alex Chen", role: "Frontend Dev", tasksCompleted: 24, productivity: 95 },
    { id: "2", name: "Sarah Johnson", role: "Designer", tasksCompleted: 18, productivity: 88 },
    { id: "3", name: "Mike Rodriguez", role: "Backend Dev", tasksCompleted: 21, productivity: 92 },
    { id: "4", name: "Emily Davis", role: "Product Manager", tasksCompleted: 15, productivity: 85 },
  ]

  const topPerformer = teamMembers.reduce((prev, current) =>
    prev.productivity > current.productivity ? prev : current,
  )

  return (
    <Card className="hover-lift transition-theme gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          Team Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Performer Highlight */}
        <div className="p-4 rounded-lg gradient-primary text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">Top Performer This Week</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarFallback className="bg-white/20 text-white font-semibold">
                {topPerformer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{topPerformer.name}</div>
              <div className="text-white/80 text-sm">{topPerformer.role}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-bold">{topPerformer.productivity}%</div>
              <div className="text-white/80 text-xs">Productivity</div>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Team Performance
          </h4>
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover-lift animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="gradient-secondary text-white text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm font-medium">{member.tasksCompleted} tasks</span>
                </div>
                <Progress value={member.productivity} className="w-16 h-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-emerald-600">+15%</div>
            <div className="text-xs text-muted-foreground">Team Velocity</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">2.3h</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
