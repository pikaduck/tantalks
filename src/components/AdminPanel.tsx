import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  ExternalLink,
  X,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { episodesApi, blogApi } from '../utils/api';
import { RichBlogEditor } from './RichBlogEditor';
import { ProfileManager } from './ProfileManager';
import { ContactMessages } from './ContactMessages';

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  tags: string[];
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  published: boolean;
  thumbnail?: string;
}

interface AdminPanelProps {
  onClose: () => void;
  accessToken: string;
  onDataChange: () => void;
  onLogout: () => void;
}

export function AdminPanel({ onClose, accessToken, onDataChange, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('episodes');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'episode' | 'blog' | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showRichEditor, setShowRichEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Episode form state
  const [episodeForm, setEpisodeForm] = useState({
    title: '',
    description: '',
    duration: '',
    thumbnail: '',
    youtubeUrl: '',
    spotifyUrl: '',
    tags: ''
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    readTime: '',
    tags: '',
    featured: false,
    published: false
  });

  // Load admin data
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [episodesData, blogData] = await Promise.all([
        episodesApi.getAll(),
        blogApi.getAllAdmin(accessToken)
      ]);
      
      setEpisodes(episodesData);
      setBlogPosts(blogData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddEpisode = async () => {
    if (!episodeForm.title.trim()) return;
    
    setIsLoading(true);
    try {
      const episodeData = {
        ...episodeForm,
        tags: episodeForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const result = await episodesApi.create(episodeData, accessToken);
      
      if (result.success) {
        showMessage('success', 'Episode created successfully');
        setEpisodeForm({
          title: '',
          description: '',
          duration: '',
          thumbnail: '',
          youtubeUrl: '',
          spotifyUrl: '',
          tags: ''
        });
        await loadAdminData();
        onDataChange();
      } else {
        showMessage('error', result.error || 'Failed to create episode');
      }
    } catch (error) {
      console.error('Error creating episode:', error);
      showMessage('error', 'Failed to create episode');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate reading time based on content
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleAddBlogPost = async () => {
    if (!blogForm.title.trim()) return;
    
    setIsLoading(true);
    try {
      // Auto-calculate reading time if not provided
      const readTime = blogForm.readTime.trim() || calculateReadingTime(blogForm.content);
      
      const postData = {
        ...blogForm,
        readTime,
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const result = await blogApi.create(postData, accessToken);
      
      if (result.success) {
        showMessage('success', 'Blog post created successfully');
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          readTime: '',
          tags: '',
          featured: false,
          published: false
        });
        await loadAdminData();
        onDataChange();
      } else {
        showMessage('error', result.error || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      showMessage('error', 'Failed to create blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;
    
    setIsLoading(true);
    try {
      const result = await episodesApi.delete(id, accessToken);
      
      if (result.success) {
        showMessage('success', 'Episode deleted successfully');
        await loadAdminData();
        onDataChange();
      } else {
        showMessage('error', result.error || 'Failed to delete episode');
      }
    } catch (error) {
      console.error('Error deleting episode:', error);
      showMessage('error', 'Failed to delete episode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    setIsLoading(true);
    try {
      const result = await blogApi.delete(id, accessToken);
      
      if (result.success) {
        showMessage('success', 'Blog post deleted successfully');
        await loadAdminData();
        onDataChange();
      } else {
        showMessage('error', result.error || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      showMessage('error', 'Failed to delete blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowRichEditor(true);
  };

  const handleSaveBlogPost = async (postData: Omit<BlogPost, 'id'>) => {
    setIsLoading(true);
    try {
      let result;
      if (editingPost) {
        // Update existing post
        result = await blogApi.update(editingPost.id, postData, accessToken);
        showMessage('success', 'Blog post updated successfully');
      } else {
        // Create new post
        result = await blogApi.create(postData, accessToken);
        showMessage('success', 'Blog post created successfully');
      }
      
      if (result.success) {
        setShowRichEditor(false);
        setEditingPost(null);
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          readTime: '',
          tags: '',
          featured: false,
          published: false
        });
        await loadAdminData();
        onDataChange();
      } else {
        showMessage('error', result.error || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showMessage('error', 'Failed to save blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowRichEditor(false);
    setEditingPost(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-6 mb-0">
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto p-6">
              {/* Episodes Tab */}
              <TabsContent value="episodes" className="space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Episode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={episodeForm.title}
                          onChange={(e) => setEpisodeForm({...episodeForm, title: e.target.value})}
                          placeholder="Episode title"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={episodeForm.duration}
                          onChange={(e) => setEpisodeForm({...episodeForm, duration: e.target.value})}
                          placeholder="e.g., 45 min"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={episodeForm.description}
                        onChange={(e) => setEpisodeForm({...episodeForm, description: e.target.value})}
                        placeholder="Episode description"
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Thumbnail URL</Label>
                        <Input
                          value={episodeForm.thumbnail}
                          onChange={(e) => setEpisodeForm({...episodeForm, thumbnail: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label>YouTube URL</Label>
                        <Input
                          value={episodeForm.youtubeUrl}
                          onChange={(e) => setEpisodeForm({...episodeForm, youtubeUrl: e.target.value})}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div>
                        <Label>Spotify URL</Label>
                        <Input
                          value={episodeForm.spotifyUrl}
                          onChange={(e) => setEpisodeForm({...episodeForm, spotifyUrl: e.target.value})}
                          placeholder="https://spotify.com/..."
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={episodeForm.tags}
                        onChange={(e) => setEpisodeForm({...episodeForm, tags: e.target.value})}
                        placeholder="AI, Technology, Consciousness"
                      />
                    </div>

                    <Button onClick={handleAddEpisode} className="w-full" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Adding...' : 'Add Episode'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Episodes List */}
                <div className="space-y-4">
                  {episodes.map((episode) => (
                    <Card key={episode.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{episode.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{episode.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{episode.duration}</span>
                              <span>•</span>
                              <span>{episode.publishDate}</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {episode.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteEpisode(episode.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Blog Tab */}
              <TabsContent value="blog" className="space-y-6 m-0">
                {showRichEditor ? (
                  <Card>
                    <CardContent className="p-6">
                      <RichBlogEditor
                        post={editingPost}
                        onSave={handleSaveBlogPost}
                        onCancel={handleCancelEdit}
                        isLoading={isLoading}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Blog Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setShowRichEditor(true)} 
                        className="w-full"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Blog Post
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Blog Posts List */}
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{post.title}</h4>
                              {post.featured && (
                                <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
                              )}
                              <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                                {post.published ? (
                                  <><Eye className="w-3 h-3 mr-1" />Published</>
                                ) : (
                                  <><EyeOff className="w-3 h-3 mr-1" />Draft</>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{post.readTime}</span>
                              <span>•</span>
                              <span>{post.publishDate}</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditBlogPost(post)}
                              disabled={isLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteBlogPost(post.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 m-0">
                <ProfileManager 
                  accessToken={accessToken} 
                  onDataChange={onDataChange}
                />
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6 m-0">
                <ContactMessages 
                  accessToken={accessToken}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}