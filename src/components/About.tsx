import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Linkedin, Brain, Lightbulb, Rocket, Users, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProfileData } from '../utils/types';

// Calculate experience from work start date
const calculateExperience = (workStartDate?: string): string => {
  if (!workStartDate) {
    // Fallback to hardcoded 2021-01
    const startDate = new Date(2021, 0);
    const now = new Date();
    const totalMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years}.${months}`;
  }
  
  const [year, month] = workStartDate.split('-').map(Number);
  const startDate = new Date(year, month - 1); // month is 0-indexed
  const now = new Date();
  
  const totalMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  return `${years}.${months}`;
};

interface AboutProps {
  profileData: ProfileData | null;
}

export function About({ profileData }: AboutProps) {
  const experience = calculateExperience(profileData?.workStartDate);
  
  // Default values if profile data is not available
  const name = profileData?.name || 'Sakshi Tantak';
  const bio = profileData?.bio || `Sakshi has been working as a data scientist for ${experience} years now, bringing a unique blend of technical expertise and philosophical curiosity to the world of AI and technology.`;
  const photo = profileData?.photo || 'https://media.licdn.com/dms/image/v2/D5603AQEhebwWIaXzCg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708334015102?e=1759363200&v=beta&t=ctHK26gQdUnrEuA6Yh1XnIXukCXcR1jr9sJxCPjenOs';
  const linkedinUrl = profileData?.linkedinUrl || 'https://linkedin.com/in/sakshitantak';
  
  const highlights = [
    {
      icon: Brain,
      title: 'Data Science Expert',
      description: `${experience} years of experience in data science, passionate about AI and machine learning`
    },
    {
      icon: Lightbulb,
      title: 'Consciousness Explorer',
      description: 'Deep interest in neuroscience, consciousness, and the philosophical implications of AI'
    },
    {
      icon: Rocket,
      title: 'Startup Builder',
      description: 'Loves 0-1 journeys with startups, building innovative solutions from the ground up'
    },
    {
      icon: Users,
      title: 'Global Connector',
      description: 'Connecting with notable young figures and researchers in AI from across the world'
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={photo}
                alt={`${name} - Host of tantalks`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            </div>
            
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{experience}+</div>
                <div className="text-sm text-muted-foreground">Years in Data Science</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Meet <span className="text-primary">{name}</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                {profileData?.title || 'The curious mind behind tantalks'}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground">
                {bio}
              </p>
              {profileData?.achievements && (
                <p className="text-muted-foreground">
                  {profileData.achievements}
                </p>
              )}
              {!profileData?.achievements && (
                <p className="text-muted-foreground">
                  Her passion extends beyond just the technical aspects—she's deeply fascinated by AI, 
                  data science, neuroscience, consciousness, and the philosophies that surround these fields. 
                  This unique perspective shapes every conversation on tantalks.
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <highlight.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-foreground">
                Through tantalks, {name} aims to present her thoughts and opinions alongside notable 
                young figures and researchers in AI from across the world, creating a platform for 
                meaningful dialogue about the future of intelligence.
              </p>
              
              <Button className="group" asChild>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Connect on LinkedIn
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}