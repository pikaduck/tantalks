import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface BlogListingProps {
  posts: BlogPost[];
  onBack: () => void;
  onPostClick: (post: BlogPost) => void;
}

export function BlogListing({ posts, onBack, onPostClick }: BlogListingProps) {
  const publishedPosts = posts.filter(post => post.published);
  const featuredPost = publishedPosts.find(post => post.featured);
  const regularPosts = publishedPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              All Blog Posts
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deep dives into AI, consciousness, and the intersection of technology and philosophy.
            </p>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card 
            className="mb-12 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
            onClick={() => onPostClick(featuredPost)}
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="aspect-video md:aspect-square h-full">
                  <ImageWithFallback
                    src={featuredPost.thumbnail || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-primary text-primary-foreground">Featured</Badge>
                <CardTitle className="text-2xl mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </CardTitle>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.publishDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="w-fit group">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => onPostClick(post)}
            >
              <div className="aspect-video rounded-t-lg overflow-hidden">
                <ImageWithFallback
                  src={post.thumbnail || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.publishDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full group">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {publishedPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Blog Posts Yet</h3>
            <p className="text-muted-foreground">
              Blog posts will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}