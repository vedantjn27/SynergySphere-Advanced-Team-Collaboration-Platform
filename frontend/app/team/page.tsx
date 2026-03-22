"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Sidebar } from "@/components/layout/sidebar"
import { TeamMemberCard } from "@/components/team/team-member-card"
import { OrganizationManager } from "@/components/team/organization-manager"
import { TeamStats } from "@/components/team/team-stats"
import { InviteUserDialog } from "@/components/team/invite-user-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, UserPlus, Users } from "lucide-react"

export default function TeamPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const projectsData :any= await apiService.getProjects()
        setProjects(projectsData)

        // Extract unique team members from all projects
        const membersMap = new Map()

        projectsData.forEach((project: any) => {
          project.members?.forEach((member: any) => {
            const memberId = member.user_id
            if (!membersMap.has(memberId)) {
              membersMap.set(memberId, {
                user_id: memberId,
                projects: [{ ...project, role: member.role }],
                roles: [member.role],
                added_at: member.added_at,
              })
            } else {
              const existingMember = membersMap.get(memberId)
              existingMember.projects.push({ ...project, role: member.role })
              if (!existingMember.roles.includes(member.role)) {
                existingMember.roles.push(member.role)
              }
            }
          })
        })

        const members:any = Array.from(membersMap.values())
        setAllMembers(members)
        setFilteredMembers(members)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load team data")
        console.error("Team data fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [user])

  useEffect(() => {
    if (searchQuery) {
      const filtered = allMembers.filter(
        (member: any) =>
          member.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.projects.some((project: any) => project.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredMembers(filtered)
    } else {
      setFilteredMembers(allMembers)
    }
  }, [allMembers, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading team data...</p>
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
            <p className="text-destructive mb-4">Error loading team data: {error}</p>
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="md:ml-64">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Team</h1>
              <p className="text-muted-foreground mt-1">Manage your team members and collaboration</p>
            </div>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>

          {/* Team Stats */}
          <TeamStats projects={projects} members={allMembers} />

          {/* Tabs */}
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList>
              <TabsTrigger value="members">Team Members ({filteredMembers.length})</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Members Grid */}
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {allMembers.length === 0 ? "No team members yet" : "No members match your search"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {allMembers.length === 0
                      ? "Invite team members to start collaborating on projects"
                      : "Try adjusting your search criteria"}
                  </p>
                  {allMembers.length === 0 && (
                    <Button onClick={() => setIsInviteDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite First Member
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMembers.map((member: any) => (
                    <TeamMemberCard key={member.user_id} member={member} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="organizations">
              <OrganizationManager />
            </TabsContent>
          </Tabs>

          {/* Invite User Dialog */}
          <InviteUserDialog
            isOpen={isInviteDialogOpen}
            onClose={() => setIsInviteDialogOpen(false)}
            projects={projects}
          />
        </div>
      </div>
    </div>
  )
}
