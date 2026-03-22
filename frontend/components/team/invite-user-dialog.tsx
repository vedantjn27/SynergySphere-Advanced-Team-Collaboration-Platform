"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, UserPlus } from "lucide-react"

interface InviteUserDialogProps {
  isOpen: boolean
  onClose: () => void
  projects: any[]
}

export function InviteUserDialog({ isOpen, onClose, projects }: InviteUserDialogProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedRole, setSelectedRole] = useState("contributor")
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return

    setSearching(true)
    setError("")
    try {
      const results:any = await apiService.searchUsers(searchQuery.trim())
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search users")
    } finally {
      setSearching(false)
    }
  }

  const handleInvite = async () => {
    if (!selectedUser || !selectedProject) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await apiService.addProjectMember(selectedProject, {
        user_id: selectedUser.id,
        role: selectedRole,
      })
      setSuccess(`Successfully invited ${selectedUser.username} to the project!`)

      // Reset form
      setSelectedUser(null)
      setSelectedProject("")
      setSelectedRole("contributor")
      setSearchQuery("")
      setSearchResults([])

      // Close dialog after a delay
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite user")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedUser(null)
    setSelectedProject("")
    setSelectedRole("contributor")
    setError("")
    setSuccess("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Search for users and invite them to join your project</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* User Search */}
          <div className="space-y-2">
            <Label>Search Users</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="outline" onClick={handleSearch} disabled={searching || searchQuery.length < 2}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Search Results</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {searchResults.map((searchUser: any) => (
                  <div
                    key={searchUser.id}
                    className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser?.id === searchUser.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedUser(searchUser)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{searchUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{searchUser.username}</p>
                      <p className="text-xs text-muted-foreground">{searchUser.email}</p>
                    </div>
                    {selectedUser?.id === searchUser.id && <Badge variant="outline">Selected</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Selection */}
          {selectedUser && (
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Role Selection */}
          {selectedUser && selectedProject && (
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Can view project and tasks</SelectItem>
                  <SelectItem value="contributor">Contributor - Can create and edit tasks</SelectItem>
                  <SelectItem value="manager">Manager - Full project management access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleInvite} disabled={loading || !selectedUser || !selectedProject} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
