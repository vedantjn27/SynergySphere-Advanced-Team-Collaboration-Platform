"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskFiltersProps {
  statusFilter: string
  projectFilter: string
  projects: any[]
  onStatusChange: (value: string) => void
  onProjectChange: (value: string) => void
}

export function TaskFilters({
  statusFilter,
  projectFilter,
  projects,
  onStatusChange,
  onProjectChange,
}: TaskFiltersProps) {
  return (
    <div className="flex gap-2">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={projectFilter} onValueChange={onProjectChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project._id} value={project._id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
