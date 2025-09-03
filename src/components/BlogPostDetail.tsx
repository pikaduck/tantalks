import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, ArrowLeft, Share2, BookmarkPlus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MarkdownRenderer } from './MarkdownRenderer';
import { BlogPost, ProfileData } from '../utils/types';
import { profileApi } from '../utils/api';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export function BlogPostDetail({ post, onBack }: BlogPostDetailProps) {
  const [author, setAuthor] = useState<ProfileData | null>({
    "name": "Sakshi Tantak",
    "photo": "https://media.licdn.com/dms/image/D4D03AQHh5bX3f1nXxg/profile-displayphoto-shrink_800_800/0/1683297034867?e=1693440000&v=beta&t=KXJtY8kYkLhYl2b1Uu8nRZ8jv6lG3F3cXoXoZy5cQzI",
    "linkedinUrl": "https://www.linkedin.com/in/sakshi-tantak"
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthor = async () => {
    setIsLoading(true);
    try {
      const profile = await profileApi.getProfile();
      setAuthor(profile);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch author profile', error);
      setError('Failed to load author information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, []);
  console.log("Author Profile : ", author);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Button>

        {/* Hero Image */}
        {post.thumbnail && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-xl">
            <ImageWithFallback
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="space-y-6 mb-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.featured && (
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            )}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            <MarkdownRenderer content={post.content} />
          </CardContent>
        </Card>

        {/* Author Bio */}
        <Card className="mt-12 bg-muted/50">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={author.photo || ''}
                  alt={author.name || ''}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">Sakshi Tantak</h3>
                <p className="text-muted-foreground mb-4">
                  Data scientist passionate about AI, neuroscience, and consciousness. 
                  Host of tantalks podcast exploring the intersection of technology and philosophy.
                </p>
                <Button variant="outline" asChild>
                  <a 
                    href={author.linkedinUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Follow on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}