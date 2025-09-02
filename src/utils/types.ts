// Shared types for the tantalks application

export interface Episode {
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
  
  export interface BlogPost {
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
  
  export interface ProfileData {
    id?: string;
    bio: string;
    name: string;
    email: string;
    photo: string;
    title: string;
    skills: string[];
    education: string;
    twitterUrl: string;
    linkedinUrl: string;
    achievements: string;
    workStartDate: string;
  }
  
  export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    body: string;
    timestamp: string;
    status: 'new' | 'read' | 'replied';
  }
  
  export interface AuthResponse {
    success: boolean;
    access_token?: string;
    user?: any;
    error?: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }