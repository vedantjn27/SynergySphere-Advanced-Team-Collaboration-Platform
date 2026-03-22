"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Plus, Users, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function OrganizationManager() {
  const { user } = useAuth()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newOrgName, setNewOrgName] = useState("")
  const [joinOrgId, setJoinOrgId] = useState("")

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await apiService.createOrganization({ name: newOrgName.trim() })
      setSuccess("Organization created successfully!")
      setNewOrgName("")
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinOrgId.trim()) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await apiService.joinOrganization({ organization_id: joinOrgId.trim() })
      setSuccess("Successfully joined organization!")
      setJoinOrgId("")
      setIsJoinDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Organizations</h2>
          <p className="text-muted-foreground">Manage your organization memberships</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
                <DialogDescription>Create a new organization to manage your team projects</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrganization} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    placeholder="Enter organization name"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading || !newOrgName.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Organization"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Join Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Organization</DialogTitle>
                <DialogDescription>Enter the organization ID to join an existing organization</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJoinOrganization} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgId">Organization ID *</Label>
                  <Input
                    id="orgId"
                    placeholder="Enter organization ID"
                    value={joinOrgId}
                    onChange={(e) => setJoinOrgId(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading || !joinOrgId.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Organization"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsJoinDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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

      {/* Organizations List */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              My Organizations
            </CardTitle>
            <CardDescription>Organizations you own or are a member of</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">No organizations yet</p>
              <p className="text-xs mt-1">Create or join an organization to get started</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your organization settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Organization Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Centralized project management</li>
                <li>• Team member collaboration</li>
                <li>• Shared resources and templates</li>
                <li>• Advanced analytics and reporting</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Learn More
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
