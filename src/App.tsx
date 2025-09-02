import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Episodes } from "./components/Episodes";
import { About } from "./components/About";
import { Blog } from "./components/Blog";
import { Footer } from "./components/Footer";
import { AdminPanel } from "./components/AdminPanel";
import { AdminAuth } from "./components/AdminAuth";
import { AdminSetup } from "./components/AdminSetup";
import { EpisodeListing } from "./components/EpisodeListing";
import { BlogListing } from "./components/BlogListing";
import { BlogPostDetail } from "./components/BlogPostDetail";
import {
  episodesApi,
  blogApi,
  profileApi,
} from "./utils/api";
import {
  Episode,
  BlogPost,
  ProfileData,
} from "./utils/types";
import { projectId } from "./utils/supabase/info";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "home" | "episodes" | "blog" | "blogPost"
  >("home");
  const [selectedBlogPost, setSelectedBlogPost] =
    useState<BlogPost | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Access Token : ", accessToken);

  // Check for admin access and load data
  useEffect(() => {
    const checkAdminAccess = async () => {
      const adminKey = localStorage.getItem("tantalks_admin");
      const token = localStorage.getItem(
        "tantalks_access_token",
      );

      if (adminKey === "authenticated" && token) {
        // Verify token is still valid by making a test API call
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-cd010421/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            setIsAdmin(true);
            setAccessToken(token);
          } else {
            // Token is invalid, clear it
            console.log("Token validation failed, clearing admin session");
            localStorage.removeItem("tantalks_admin");
            localStorage.removeItem("tantalks_access_token");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // Clear invalid session
          localStorage.removeItem("tantalks_admin");
          localStorage.removeItem("tantalks_access_token");
        }
      }
    };

    const loadData = async () => {
      try {
        const [episodesData, blogData, profileData] = await Promise.all([
          episodesApi.getAll(),
          blogApi.getPublished(),
          profileApi.getProfile(),
        ]);

        setEpisodes(episodesData);
        setBlogPosts(blogData);
        setProfileData(profileData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeApp = async () => {
      await checkAdminAccess();
      await loadData();
    };

    initializeApp();
  }, []);

  const handleAdminClick = () => {
    if (isAdmin) {
      setShowAdmin(true);
    } else {
      setShowAdminAuth(true);
    }
  };

  const handleAdminAuth = (token: string) => {
    setIsAdmin(true);
    setAccessToken(token);
    setShowAdminAuth(false);
    setShowAdmin(true);
  };

  const handleSetupClick = () => {
    setShowAdminAuth(false);
    setShowAdminSetup(true);
  };

  const handleSetupComplete = () => {
    setShowAdminSetup(false);
    setShowAdminAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("tantalks_admin");
    localStorage.removeItem("tantalks_access_token");
    setIsAdmin(false);
    setAccessToken(null);
    setShowAdmin(false);
  };

  const refreshData = async () => {
    try {
      const [episodesData, blogData, profileDataRefresh] = await Promise.all([
        episodesApi.getAll(),
        blogApi.getPublished(),
        profileApi.getProfile(),
      ]);

      setEpisodes(episodesData);
      setBlogPosts(blogData);
      setProfileData(profileDataRefresh);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleViewAllEpisodes = () => {
    setCurrentView("episodes");
  };

  const handleViewAllBlog = () => {
    setCurrentView("blog");
  };

  const handleBlogPostClick = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView("blogPost");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedBlogPost(null);
  };

  const handleNavigateToSection = (section: string) => {
    // If we're not on the home page, navigate to home first
    if (currentView !== "home") {
      handleBackToHome();
    }

    // Then scroll to the section after a brief delay
    setTimeout(
      () => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
      currentView !== "home" ? 300 : 100,
    );
  };

  const handleLatestEpisode = () => {
    if (episodes.length > 0) {
      // Try to open the latest episode's URL first
      const latestEpisode = episodes[0];
      if (latestEpisode.youtubeUrl) {
        window.open(latestEpisode.youtubeUrl, "_blank");
        return;
      } else if (latestEpisode.spotifyUrl) {
        window.open(latestEpisode.spotifyUrl, "_blank");
        return;
      }
    }

    // Fallback: Navigate to episodes section
    handleNavigateToSection("episodes");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading tantalks...
          </p>
        </div>
      </div>
    );
  }

  // Render different views
  const renderView = () => {
    switch (currentView) {
      case "episodes":
        return (
          <EpisodeListing
            episodes={episodes}
            onBack={handleBackToHome}
          />
        );
      case "blog":
        return (
          <BlogListing
            posts={blogPosts}
            onBack={handleBackToHome}
            onPostClick={handleBlogPostClick}
          />
        );
      case "blogPost":
        return selectedBlogPost ? (
          <BlogPostDetail
            post={selectedBlogPost}
            onBack={() => setCurrentView("blog")}
          />
        ) : null;
      default:
        return (
          <>
            <Hero onLatestEpisode={handleLatestEpisode} />
            <Episodes
              episodes={episodes}
              onViewAll={handleViewAllEpisodes}
            />
            <About profileData={profileData} />
            <Blog
              posts={blogPosts}
              onViewAll={handleViewAllBlog}
              onPostClick={handleBlogPostClick}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAdminClick={handleAdminClick}
        isAdmin={isAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateToSection={handleNavigateToSection}
      />

      <main>{renderView()}</main>

      {currentView === "home" && (
        <Footer onNavigate={handleBackToHome} profileData={profileData} />
      )}

      {/* Admin Setup */}
      {showAdminSetup && (
        <AdminSetup
          onClose={() => setShowAdminSetup(false)}
          onSetupComplete={handleSetupComplete}
        />
      )}

      {/* Admin Authentication */}
      {showAdminAuth && (
        <AdminAuth
          onAuth={handleAdminAuth}
          onClose={() => setShowAdminAuth(false)}
          onSetupClick={handleSetupClick}
        />
      )}

      {/* Admin Panel */}
      {showAdmin && isAdmin && accessToken && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          accessToken={accessToken}
          onDataChange={refreshData}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}