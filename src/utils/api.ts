import { projectId, publicAnonKey } from "./supabase/info";
import {
  Episode,
  BlogPost,
  ProfileData,
  ContactMessage,
  AuthResponse,
  ApiResponse
} from "./types";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cd010421`;

// Auth functions
export const auth = {
  async login(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login API error:", data);
        return {
          success: false,
          error: data.error || "Login failed",
        };
      }

      return data;
    } catch (error) {
      console.error("Login request error:", error);
      return {
        success: false,
        error: "Network error during login",
      };
    }
  },

  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup API error:", data);
        return {
          success: false,
          error: data.error || "Signup failed",
        };
      }

      return data;
    } catch (error) {
      console.error("Signup request error:", error);
      return {
        success: false,
        error: "Network error during signup",
      };
    }
  },
};

// Episodes API
export const episodesApi = {
  async getAll(): Promise<Episode[]> {
    try {
      const response = await fetch(`${API_BASE}/episodes`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch episodes");
        return [];
      }

      const data = await response.json();
      return data.episodes || [];
    } catch (error) {
      console.error("Error fetching episodes:", error);
      return [];
    }
  },

  async create(
    episode: Episode,
    accessToken: string,
  ): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE}/episodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(episode),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Create episode API error:", data);
        return {
          success: false,
          error: data.error || "Failed to create episode",
        };
      }

      return data;
    } catch (error) {
      console.error("Create episode request error:", error);
      return {
        success: false,
        error: "Network error while creating episode",
      };
    }
  },

  async update(
    id: string,
    episode: Partial<Episode>,
    accessToken: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${API_BASE}/episodes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(episode),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Update episode API error:", data);
        return {
          success: false,
          error: data.error || "Failed to update episode",
        };
      }

      return data;
    } catch (error) {
      console.error("Update episode request error:", error);
      return {
        success: false,
        error: "Network error while updating episode",
      };
    }
  },

  async delete(
    id: string,
    accessToken: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${API_BASE}/episodes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete episode API error:", data);
        return {
          success: false,
          error: data.error || "Failed to delete episode",
        };
      }

      return data;
    } catch (error) {
      console.error("Delete episode request error:", error);
      return {
        success: false,
        error: "Network error while deleting episode",
      };
    }
  },
};

// Blog API
export const blogApi = {
  async getPublished(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE}/blog`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch published blog posts");
        return [];
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error(
        "Error fetching published blog posts:",
        error,
      );
      return [];
    }
  },

  async getAllAdmin(accessToken: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE}/blog/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch admin blog posts");
        return [];
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      return [];
    }
  },

  async create(
    post: BlogPost,
    accessToken: string,
  ): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE}/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(post),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Create blog post API error:", data);
        return {
          success: false,
          error: data.error || "Failed to create blog post",
        };
      }

      return data;
    } catch (error) {
      console.error("Create blog post request error:", error);
      return {
        success: false,
        error: "Network error while creating blog post",
      };
    }
  },

  async update(
    id: string,
    post: Partial<BlogPost>,
    accessToken: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(post),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Update blog post API error:", data);
        return {
          success: false,
          error: data.error || "Failed to update blog post",
        };
      }

      return data;
    } catch (error) {
      console.error("Update blog post request error:", error);
      return {
        success: false,
        error: "Network error while updating blog post",
      };
    }
  },

  async delete(
    id: string,
    accessToken: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete blog post API error:", data);
        return {
          success: false,
          error: data.error || "Failed to delete blog post",
        };
      }

      return data;
    } catch (error) {
      console.error("Delete blog post request error:", error);
      return {
        success: false,
        error: "Network error while deleting blog post",
      };
    }
  },
};

// Profile API
export const profileApi = {
  async getProfile(): Promise<ProfileData | null> {
    console.log("Fetching profile ...");
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      console.log("Profile response:", response);

      if (!response.ok) {
        console.error("Failed to fetch profile data");
        return null;
      }

      const data = await response.json();
      return data.profile || null;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  },

  async updateProfile(
    accessToken: string,
    profile: Partial<ProfileData>,
  ): Promise<{ success: boolean; error?: string }> {
    console.log("Updating profile ...", profile);
    console.log("Using access token :", accessToken);
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      console.log("Update profile API response:", data);

      if (!response.ok) {
        console.error("Update profile API error:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        let errorMessage = "Failed to update profile";
        if (data.message === "Invalid JWT" || response.status === 401) {
          errorMessage = "Authentication expired. Please logout and login again.";
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Update profile request error:", error);
      return {
        success: false,
        error: "Network error while updating profile",
      };
    }
  },
};

// Contact API
export const contactApi = {
  async sendMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    body: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Send message API error:', result);
        return {
          success: false,
          error: result.error || 'Failed to send message',
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Send message request error:', error);
      return {
        success: false,
        error: 'Network error while sending message',
      };
    }
  },

  async getMessages(accessToken: string): Promise<ContactMessage[]> {
    try {
      const response = await fetch(`${API_BASE}/contact/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to fetch contact messages:', data);
        return [];
      }
      
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  },
};