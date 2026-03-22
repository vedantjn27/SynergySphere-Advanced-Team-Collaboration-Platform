import {
  mockUser,
  mockProjects,
  mockTasks,
  mockUsers,
  mockNotifications,
  mockComments,
  mockOrganization,
} from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // Auth endpoints
  async login(email: string, password: string) {
    await delay(1000)
    if (email === "demo@synergysphere.com" && password === "demo123") {
      return {
        access_token: "mock-jwt-token",
        refresh_token: "mock-refresh-token",
        token_type: "bearer",
        user: mockUser,
      }
    }
    throw new Error("Invalid credentials")
  },

  async register(userData: any) {
    await delay(1000)
    return {
      access_token: "mock-jwt-token",
      refresh_token: "mock-refresh-token",
      token_type: "bearer",
      user: { ...mockUser, ...userData, id: "user-new" },
    }
  },

  async refreshToken() {
    await delay(500)
    return {
      access_token: "mock-jwt-token-refreshed",
      token_type: "bearer",
    }
  },

  // User endpoints
  async getCurrentUser() {
    await delay(300)
    return mockUser
  },

  async searchUsers(query: string) {
    await delay(500)
    return mockUsers.filter(
      (user) =>
        user.full_name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()),
    )
  },

  // Project endpoints
  async getProjects() {
    await delay(800)
    return mockProjects
  },

  async getProject(id: string) {
    await delay(500)
    const project = mockProjects.find((p) => p.id === id)
    if (!project) throw new Error("Project not found")
    return project
  },

  async createProject(projectData: any) {
    await delay(1000)
    const newProject = {
      id: `proj-${Date.now()}`,
      ...projectData,
      created_at: new Date().toISOString(),
      owner_id: mockUser.id,
      organization_id: mockOrganization.id,
      members: [mockUser.id],
    }
    mockProjects.push(newProject)
    return newProject
  },

  async updateProject(id: string, updates: any) {
    await delay(800)
    const index = mockProjects.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Project not found")
    mockProjects[index] = { ...mockProjects[index], ...updates }
    return mockProjects[index]
  },

  async deleteProject(id: string) {
    await delay(500)
    const index = mockProjects.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Project not found")
    mockProjects.splice(index, 1)
    return { message: "Project deleted successfully" }
  },

  // Task endpoints
  async getTasks(projectId?: string) {
    await delay(600)
    if (projectId) {
      return mockTasks.filter((task) => task.project_id === projectId)
    }
    return mockTasks
  },

  async getTask(id: string) {
    await delay(400)
    const task = mockTasks.find((t) => t.id === id)
    if (!task) throw new Error("Task not found")
    return task
  },

  async createTask(taskData: any) {
    await delay(800)
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      created_at: new Date().toISOString(),
      created_by: mockUser.id,
    }
    mockTasks.push(newTask)
    return newTask
  },

  async updateTask(id: string, updates: any) {
    await delay(600)
    const index = mockTasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Task not found")
    mockTasks[index] = { ...mockTasks[index], ...updates }
    return mockTasks[index]
  },

  async deleteTask(id: string) {
    await delay(400)
    const index = mockTasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Task not found")
    mockTasks.splice(index, 1)
    return { message: "Task deleted successfully" }
  },

  // Comment endpoints
  async getTaskComments(taskId: string) {
    await delay(400)
    return mockComments.filter((comment) => comment.task_id === taskId)
  },

  async createComment(commentData: any) {
    await delay(600)
    const newComment = {
      id: `comment-${Date.now()}`,
      ...commentData,
      user_id: mockUser.id,
      created_at: new Date().toISOString(),
    }
    mockComments.push(newComment)
    return newComment
  },

  // Notification endpoints
  async getNotifications() {
    await delay(500)
    return mockNotifications.filter((notif) => notif.user_id === mockUser.id)
  },

  async markNotificationRead(id: string) {
    await delay(300)
    const notification = mockNotifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
    return notification
  },

  async deleteNotification(id: string) {
    await delay(300)
    const index = mockNotifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      mockNotifications.splice(index, 1)
    }
    return { message: "Notification deleted" }
  },

  // Organization endpoints
  async getOrganization() {
    await delay(400)
    return mockOrganization
  },

  async createOrganization(orgData: any) {
    await delay(800)
    return {
      id: `org-${Date.now()}`,
      ...orgData,
      created_at: new Date().toISOString(),
      owner_id: mockUser.id,
    }
  },
}
