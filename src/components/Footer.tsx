import React from 'react';
import { Brain, Youtube, Music, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { ContactForm } from './ContactForm';
import { ProfileData } from '../utils/types';

interface FooterProps {
  onNavigate: () => void;
  profileData: ProfileData | null;
}

export function Footer({ onNavigate, profileData }: FooterProps) {
  const scrollToSection = (id: string) => {
    onNavigate(); // Ensure we're on the home page
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">tantalks</span>
            </div>
            <p className="text-muted text-sm">
              Where science, technology, and the mysteries of the mind converge.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <button 
                className="text-muted hover:text-background transition-colors text-left text-sm"
                onClick={() => scrollToSection('episodes')}
              >
                Latest Episodes
              </button>
              <button 
                className="text-muted hover:text-background transition-colors text-left text-sm"
                onClick={() => scrollToSection('about')}
              >
                About Sakshi
              </button>
              <button 
                className="text-muted hover:text-background transition-colors text-left text-sm"
                onClick={() => scrollToSection('blog')}
              >
                Blog
              </button>
              <ContactForm>
                <button className="text-muted hover:text-background transition-colors text-left text-sm">
                  Contact
                </button>
              </ContactForm>
            </nav>
          </div>

          {/* Listen On */}
          <div className="space-y-4">
            <h4 className="font-semibold">Listen On</h4>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="sm" className="justify-start p-0 h-auto text-muted hover:text-background">
                <Youtube className="w-4 h-4 mr-2" />
                YouTube
              </Button>
              <Button variant="ghost" size="sm" className="justify-start p-0 h-auto text-muted hover:text-background">
                <Music className="w-4 h-4 mr-2" />
                Spotify
              </Button>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start p-0 h-auto text-muted hover:text-background"
                asChild
              >
                <a href="https://linkedin.com/in/sakshitantak" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <ContactForm>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start p-0 h-auto text-muted hover:text-background"
                >
                  Get in Touch
                </Button>
              </ContactForm>
            </div>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted text-sm">
            © 2024 tantalks. All rights reserved.
          </p>
          <p className="text-muted text-sm mt-4 md:mt-0">
            Made with passion for AI and consciousness
          </p>
        </div>
      </div>
    </footer>
  );
}