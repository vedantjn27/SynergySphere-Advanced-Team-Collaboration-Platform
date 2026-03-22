"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const productivityData = [
  { name: "Mon", tasks: 12, completed: 8 },
  { name: "Tue", tasks: 15, completed: 12 },
  { name: "Wed", tasks: 8, completed: 6 },
  { name: "Thu", tasks: 18, completed: 15 },
  { name: "Fri", tasks: 14, completed: 11 },
  { name: "Sat", tasks: 6, completed: 5 },
  { name: "Sun", tasks: 4, completed: 4 },
]

const projectProgress = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 35 },
  { name: "Week 3", progress: 55 },
  { name: "Week 4", progress: 78 },
]

export function ProductivityChart() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="hover-lift transition-theme gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-subtle"></div>
            Weekly Productivity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="completed" fill="hsl(var(--chart-1))" radius={4} />
              <Bar dataKey="tasks" fill="hsl(var(--chart-2))" radius={4} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="hover-lift transition-theme gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-subtle"></div>
            Project Progress Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
