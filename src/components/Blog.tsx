import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
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

// Mock data - in real app this would come from backend
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Philosophy of Artificial Intelligence: Are We Creating Minds or Tools?',
    excerpt: 'Exploring the philosophical implications of AI development and what it means to create intelligent systems.',
    content: 'Full content here...',
    publishDate: '2024-12-10',
    readTime: '8 min read',
    tags: ['AI', 'Philosophy', 'Consciousness'],
    featured: true,
    published: true
  },
  {
    id: '2',
    title: 'Data Science in Neuroscience: Bridging the Gap Between Brain and Algorithm',
    excerpt: 'How data science techniques are revolutionizing our understanding of the human brain.',
    content: 'Full content here...',
    publishDate: '2024-12-03',
    readTime: '6 min read',
    tags: ['Data Science', 'Neuroscience', 'Research'],
    published: true
  },
  {
    id: '3',
    title: 'Building AI Startups: Lessons from the Trenches',
    excerpt: 'Personal insights from working with AI startups and the unique challenges they face.',
    content: 'Full content here...',
    publishDate: '2024-11-28',
    readTime: '5 min read',
    tags: ['Startups', 'AI', 'Entrepreneurship'],
    published: true
  }
];

interface BlogProps {
  posts?: BlogPost[];
  onViewAll?: () => void;
  onPostClick?: (post: BlogPost) => void;
}

export function Blog({ posts = mockBlogPosts, onViewAll, onPostClick }: BlogProps) {
  const publishedPosts = posts.filter(post => post.published);
  const featuredPost = publishedPosts.find(post => post.featured);
  const regularPosts = publishedPosts.filter(post => !post.featured);

  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Thoughts & Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives into AI, consciousness, and the intersection of technology and philosophy.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card 
            className="mb-12 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-background to-muted/30"
            onClick={() => onPostClick?.(featuredPost)}
          >
            <div className="lg:flex lg:min-h-[400px]">
              <div className="lg:w-2/5 relative">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                  <ImageWithFallback
                    src={featuredPost.thumbnail || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                </div>
              </div>
              <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    Featured Article
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl lg:text-3xl mb-4 group-hover:text-primary transition-colors leading-tight">
                  {featuredPost.title}
                </CardTitle>
                
                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  size="lg"
                  className="w-fit group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPostClick?.(featuredPost);
                  }}
                >
                  Read Full Article
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
              onClick={() => onPostClick?.(post)}
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
                
                <Button 
                  variant="ghost" 
                  className="w-full group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPostClick?.(post);
                  }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={onViewAll}>
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
}