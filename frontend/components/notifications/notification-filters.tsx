"use client"

import { Button } from "@/components/ui/button"
import { Bell, BellRing, CheckCircle } from "lucide-react"

interface NotificationFiltersProps {
  filter: string
  onFilterChange: (filter: string) => void
}

export function NotificationFilters({ filter, onFilterChange }: NotificationFiltersProps) {
  const filters = [
    {
      id: "all",
      label: "All",
      icon: Bell,
    },
    {
      id: "unread",
      label: "Unread",
      icon: BellRing,
    },
    {
      id: "read",
      label: "Read",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="flex gap-2">
      {filters.map((filterOption) => (
        <Button
          key={filterOption.id}
          variant={filter === filterOption.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filterOption.id)}
          className="flex items-center gap-2"
        >
          <filterOption.icon className="h-4 w-4" />
          {filterOption.label}
        </Button>
      ))}
    </div>
  )
}
