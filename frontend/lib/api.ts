import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authService.getAccessToken()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshed = await authService.refreshToken()
        if (refreshed) {
          // Retry the request with new token
          const newToken = authService.getAccessToken()
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          }
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config)
          if (retryResponse.ok) {
            return retryResponse.json()
          }
        }
        // If refresh failed, redirect to login
        window.location.href = "/login"
        throw new Error("Authentication failed")
      }

      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Projects
  async getProjects() {
    return this.request<any[]>("/api/v1/projects")
  }

  async createProject(data: {
    name: string
    description?: string
    organization_id: string
    priority?: string
    start_date?: string
    end_date?: string
    tags?: string[]
  }) {
    return this.request("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getProject(projectId: string) {
    return this.request(`/api/v1/projects/${projectId}`)
  }

  // Project Members
  async addProjectMember(projectId: string, data: { user_id: string; role: string }) {
    return this.request(`/api/v1/projects/${projectId}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async removeProjectMember(projectId: string, userId: string) {
    return this.request(`/api/v1/projects/${projectId}/members/${userId}`, {
      method: "DELETE",
    })
  }

  // Tasks
  async getProjectTasks(projectId: string) {
    return this.request<any[]>(`/api/v1/projects/${projectId}/tasks`)
  }

  async createTask(
    projectId: string,
    data: {
      title: string
      description?: string
      status?: string
      creator_id: string
    },
  ) {
    return this.request(`/api/v1/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTask(
    taskId: string,
    data: {
      title?: string
      description?: string
      status?: string
    },
  ) {
    return this.request(`/api/v1/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Task Comments
  async getTaskComments(taskId: string) {
    return this.request<any[]>(`/api/v1/tasks/${taskId}/comments`)
  }

  async addTaskComment(taskId: string, data: { author_id: string; content: string }) {
    return this.request(`/api/v1/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateComment(commentId: string, data: { content: string }) {
    return this.request(`/api/v1/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteComment(commentId: string) {
    return this.request(`/api/v1/comments/${commentId}`, {
      method: "DELETE",
    })
  }

  // Task Assignment
  async assignTask(taskId: string, assigneeId: string) {
    return this.request(`/api/v1/tasks/${taskId}/assign`, {
      method: "POST",
      body: JSON.stringify({ assignee_id: assigneeId }),
    })
  }

  // Organizations
  async createOrganization(data: { name: string }) {
    return this.request("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async joinOrganization(data: { organization_id: string }) {
    return this.request("/organizations/join", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>("/api/v1/notifications")
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/api/v1/notifications/${notificationId}/read`, {
      method: "PUT",
    })
  }

  async deleteNotification(notificationId: string) {
    return this.request(`/api/v1/notifications/${notificationId}`, {
      method: "DELETE",
    })
  }

  // Users
  async searchUsers(query: string) {
    return this.request<any[]>(`/api/v1/users/search?q=${encodeURIComponent(query)}`)
  }
}

export const apiService = new ApiService()
