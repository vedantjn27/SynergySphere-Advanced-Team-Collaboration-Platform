"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from "lucide-react"
import { useState } from "react"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "task" | "meeting" | "deadline"
  project?: string
  attendees?: number
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Mock events for demonstration
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Project Kickoff Meeting",
      date: new Date(2024, 11, 15),
      type: "meeting",
      project: "SynergySphere",
      attendees: 8,
    },
    {
      id: "2",
      title: "UI Design Review",
      date: new Date(2024, 11, 18),
      type: "task",
      project: "Mobile App",
    },
    {
      id: "3",
      title: "Sprint Planning",
      date: new Date(2024, 11, 22),
      type: "meeting",
      attendees: 6,
    },
    {
      id: "4",
      title: "Feature Delivery",
      date: new Date(2024, 11, 25),
      type: "deadline",
      project: "Web Platform",
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "task":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
      case "deadline":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="hover-lift transition-theme gradient-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="hover-lift">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="hover-lift">
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="hover-lift">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isToday = date && date.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border rounded-lg transition-colors hover:bg-muted/50 ${
                  isToday ? "bg-primary/10 border-primary/30" : "border-border"
                } ${date ? "cursor-pointer" : ""}`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-center ${getEventTypeColor(event.type)}`}
                        >
                          {event.title.length > 12 ? `${event.title.slice(0, 12)}...` : event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Upcoming Events</h4>
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover-lift">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
              <div className="flex-1">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {event.date.toLocaleDateString()}
                  {event.attendees && (
                    <>
                      <Users className="h-3 w-3 ml-2" />
                      {event.attendees} attendees
                    </>
                  )}
                </div>
              </div>
              <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
