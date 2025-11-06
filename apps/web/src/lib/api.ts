const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async registerClient(data: any) {
    return this.request('/auth/register/client', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerTasker(data: any) {
    return this.request('/auth/register/tasker', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tasks
  async getTasks(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/tasks${params ? `?${params}` : ''}`);
  }

  async getTask(id: string) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(data: any, token: string) {
    return this.request('/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Skills
  async getSkills() {
    return this.request('/skills');
  }

  // Offers
  async createOffer(data: any, token: string) {
    return this.request('/offers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async acceptOffer(offerId: string, token: string) {
    return this.request(`/offers/${offerId}/accept`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const api = new ApiClient();
