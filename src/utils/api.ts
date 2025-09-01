import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cd010421`;

interface Episode {
  id?: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  tags: string[];
  publishDate?: string;
}

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  published: boolean;
  publishDate?: string;
  thumbnail?: string;
}

interface AuthResponse {
  success: boolean;
  access_token?: string;
  user?: any;
  error?: string;
}

// Auth functions
export const auth = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Login API error:', data);
        return { success: false, error: data.error || 'Login failed' };
      }

      return data;
    } catch (error) {
      console.error('Login request error:', error);
      return { success: false, error: 'Network error during login' };
    }
  },

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Signup API error:', data);
        return { success: false, error: data.error || 'Signup failed' };
      }

      return data;
    } catch (error) {
      console.error('Signup request error:', error);
      return { success: false, error: 'Network error during signup' };
    }
  }
};

// Episodes API
export const episodesApi = {
  async getAll(): Promise<Episode[]> {
    try {
      const response = await fetch(`${API_BASE}/episodes`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch episodes');
        return [];
      }

      const data = await response.json();
      return data.episodes || [];
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  },

  async create(episode: Episode, accessToken: string): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/episodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(episode)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Create episode API error:', data);
        return { success: false, error: data.error || 'Failed to create episode' };
      }

      return data;
    } catch (error) {
      console.error('Create episode request error:', error);
      return { success: false, error: 'Network error while creating episode' };
    }
  },

  async update(id: string, episode: Partial<Episode>, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/episodes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(episode)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Update episode API error:', data);
        return { success: false, error: data.error || 'Failed to update episode' };
      }

      return data;
    } catch (error) {
      console.error('Update episode request error:', error);
      return { success: false, error: 'Network error while updating episode' };
    }
  },

  async delete(id: string, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/episodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Delete episode API error:', data);
        return { success: false, error: data.error || 'Failed to delete episode' };
      }

      return data;
    } catch (error) {
      console.error('Delete episode request error:', error);
      return { success: false, error: 'Network error while deleting episode' };
    }
  }
};

// Blog API
export const blogApi = {
  async getPublished(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE}/blog`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch published blog posts');
        return [];
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }
  },

  async getAllAdmin(accessToken: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE}/blog/admin`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch admin blog posts');
        return [];
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching admin blog posts:', error);
      return [];
    }
  },

  async create(post: BlogPost, accessToken: string): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(post)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Create blog post API error:', data);
        return { success: false, error: data.error || 'Failed to create blog post' };
      }

      return data;
    } catch (error) {
      console.error('Create blog post request error:', error);
      return { success: false, error: 'Network error while creating blog post' };
    }
  },

  async update(id: string, post: Partial<BlogPost>, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(post)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Update blog post API error:', data);
        return { success: false, error: data.error || 'Failed to update blog post' };
      }

      return data;
    } catch (error) {
      console.error('Update blog post request error:', error);
      return { success: false, error: 'Network error while updating blog post' };
    }
  },

  async delete(id: string, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Delete blog post API error:', data);
        return { success: false, error: data.error || 'Failed to delete blog post' };
      }

      return data;
    } catch (error) {
      console.error('Delete blog post request error:', error);
      return { success: false, error: 'Network error while deleting blog post' };
    }
  }
};