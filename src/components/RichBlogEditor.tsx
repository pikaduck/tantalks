import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Save, 
  Eye, 
  Upload, 
  ImageIcon, 
  Type, 
  Bold, 
  Italic, 
  List, 
  Link2,
  X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  published: boolean;
  thumbnail?: string;
}

interface RichBlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function RichBlogEditor({ post, onSave, onCancel, isLoading }: RichBlogEditorProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    readTime: post?.readTime || '',
    tags: post?.tags?.join(', ') || '',
    featured: post?.featured || false,
    published: post?.published || false,
    thumbnail: post?.thumbnail || ''
  });

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isDragOver, setIsDragOver] = useState(false);

  // Calculate reading time based on content
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: value,
      // Auto-update reading time if not manually set
      readTime: prev.readTime || calculateReadingTime(value)
    }));
  };

  const insertMarkdown = (markdown: string, wrap = false) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText;
    if (wrap && selectedText) {
      newText = markdown.replace('{}', selectedText);
    } else {
      newText = markdown;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      newText + 
      formData.content.substring(end);

    handleContentChange(newContent);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageUpload = useCallback((file: File) => {
    // In a real implementation, you'd upload to a service like Supabase Storage
    // For now, we'll use a placeholder
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      insertMarkdown(`![Image description](${imageUrl})\n\n`);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(handleImageUpload);
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    const readTime = formData.readTime.trim() || calculateReadingTime(formData.content);
    
    await onSave({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      readTime,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      featured: formData.featured,
      published: formData.published,
      thumbnail: formData.thumbnail
    });
  };

  const renderMarkdownPreview = (content: string) => {
    // Simple markdown rendering - in production, use a proper markdown parser
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline">$1</a>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/^(.+)$/gim, '<p class="mb-4">$1</p>');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter a compelling title..."
            className="text-lg"
          />
        </div>
        <div>
          <Label>Thumbnail URL (optional)</Label>
          <Input
            value={formData.thumbnail}
            onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div>
        <Label>Excerpt</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Write a compelling excerpt that will appear in listings..."
          rows={2}
          className="resize-none"
        />
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Content</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formData.content ? calculateReadingTime(formData.content) : '0 min read'}
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            {/* Toolbar */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('**{}**', true)}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('*{}*', true)}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('## Heading\n\n')}
                title="Heading"
              >
                <Type className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('- List item\n')}
                title="List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('[Link text](https://example.com)')}
                title="Link"
              >
                <Link2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                title="Upload Image"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="write" className="m-0">
            <div 
              className={`relative ${isDragOver ? 'ring-2 ring-primary' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Textarea
                name="content"
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing your blog post... (Supports Markdown)

You can:
- Drag & drop images directly
- Use markdown formatting (**bold**, *italic*, ## headings)
- Add links [text](url)
- Create lists with - or 1."
                rows={16}
                className="font-mono text-sm resize-none"
              />
              {isDragOver && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-primary font-medium">Drop images here</p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                Array.from(e.target.files || []).forEach(handleImageUpload);
                e.target.value = '';
              }}
            />
          </TabsContent>

          <TabsContent value="preview" className="m-0">
            <Card className="min-h-[400px]">
              <CardContent className="p-6">
                {formData.title && (
                  <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
                )}
                {formData.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6 italic">{formData.excerpt}</p>
                )}
                {formData.thumbnail && (
                  <div className="mb-6">
                    <ImageWithFallback
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownPreview(formData.content) 
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Metadata */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Tags (comma separated)</Label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="AI, Philosophy, Research"
          />
        </div>
        <div>
          <Label>Reading Time (auto-calculated)</Label>
          <Input
            value={formData.readTime}
            onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
            placeholder={calculateReadingTime(formData.content)}
          />
        </div>
      </div>

      {/* Publishing Options */}
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
          />
          <Label>Featured Post</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
          />
          <Label>Published</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={isLoading || !formData.title.trim()}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : formData.published ? 'Publish Post' : 'Save Draft'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        {formData.content && (
          <Button variant="ghost" onClick={() => setActiveTab('preview')}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}
      </div>
    </div>
  );
}