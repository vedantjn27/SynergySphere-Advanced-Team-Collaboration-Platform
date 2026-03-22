"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Crown, User, FolderKanban, Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TeamMemberCardProps {
  member: {
    user_id: string
    projects: Array<{
      _id: string
      name: string
      role: string
      owner_id: string
    }>
    roles: string[]
    added_at?: string
  }
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "manager":
        return <Crown className="h-3 w-3 text-primary" />
      case "contributor":
        return <User className="h-3 w-3 text-secondary" />
      case "viewer":
        return <User className="h-3 w-3 text-muted-foreground" />
      default:
        return <User className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-primary text-primary-foreground"
      case "contributor":
        return "bg-secondary text-secondary-foreground"
      case "viewer":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getHighestRole = () => {
    if (member.roles.includes("manager")) return "manager"
    if (member.roles.includes("contributor")) return "contributor"
    return "viewer"
  }

  const isOwner = member.projects.some((project) => project.owner_id === member.user_id)
  const highestRole = getHighestRole()

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg font-semibold">
                {member.user_id.slice(-2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">ID: {member.user_id.slice(-8)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Send Message</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role and Status */}
        <div className="flex items-center gap-2">
          <Badge className={getRoleColor(highestRole)}>
            {getRoleIcon(highestRole)}
            <span className="ml-1">{highestRole}</span>
          </Badge>
          {isOwner && (
            <Badge variant="outline">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          )}
        </div>

        {/* Projects */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderKanban className="h-4 w-4" />
            <span>Projects ({member.projects.length})</span>
          </div>
          <div className="space-y-1">
            {member.projects.slice(0, 3).map((project) => (
              <div key={project._id} className="flex items-center justify-between text-sm">
                <span className="truncate">{project.name}</span>
                <Badge variant="outline" className="text-xs">
                  {project.role}
                </Badge>
              </div>
            ))}
            {member.projects.length > 3 && (
              <p className="text-xs text-muted-foreground">+{member.projects.length - 3} more projects</p>
            )}
          </div>
        </div>

        {/* Join Date */}
        {member.added_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(member.added_at).toLocaleDateString()}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            View Projects
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
