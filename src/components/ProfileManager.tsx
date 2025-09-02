import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Save,
  Upload,
  User,
  RefreshCw,
  Camera,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { profileApi, ProfileData } from "../utils/api";

interface ProfileManagerProps {
  accessToken: string;
  onDataChange: () => void;
}

export function ProfileManager({
  accessToken,
  onDataChange,
}: ProfileManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    name: '',
    email: '',
    photo: '',
    title: '',
    skills: [],
    education: '',
    twitterUrl: '',
    linkedinUrl: '',
    achievements: '',
    workStartDate: '2021-01'
  });

  const showMessage = (
    type: "success" | "error",
    text: string,
  ) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const calculateExperience = (startDate: string): string => {
    if (!startDate) return "0.0";

    const [year, month] = startDate.split("-").map(Number);
    const start = new Date(year, month - 1); // month is 0-indexed
    const now = new Date();

    const totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years}.${months}`;
  };

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const data = await profileApi.getProfile();
      console.log("Loaded profile data:", data);
      if (data) {
        setProfileData({
          ...data,
          skills: data.skills || [],
          bio: data.bio || '',
          name: data.name || '',
          email: data.email || '',
          photo: data.photo || '',
          title: data.title || '',
          education: data.education || '',
          twitterUrl: data.twitterUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          achievements: data.achievements || '',
          workStartDate: data.workStartDate || '2021-01'
        });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      showMessage("error", "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileData = async () => {
    if (!profileData?.name?.trim()) {
      showMessage("error", "Name is required");
      return;
    }

    if (!accessToken) {
      showMessage("error", "Authentication required. Please logout and login again.");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Saving profile with access token:', accessToken);
      console.log('Profile data to save:', profileData);
      
      const result = await profileApi.updateProfile(
        accessToken,
        profileData,
      );
      
      console.log('Profile update result:', result);
      
      if (!result.success) {
        // Handle specific JWT error
        if (result.error?.includes('JWT') || result.error?.includes('Unauthorized')) {
          showMessage("error", "Session expired. Please logout and login again.");
        } else {
          showMessage("error", result.error || "Failed to save profile data");
        }
        return;
      }

      showMessage("success", "Profile updated successfully");
      onDataChange();
    } catch (error) {
      console.error("Error saving profile data:", error);
      if (error.message?.includes('JWT') || error.message?.includes('401')) {
        showMessage("error", "Session expired. Please logout and login again.");
      } else {
        showMessage("error", "Failed to save profile data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  if (isLoading) {
    // Render a loading state until the data is fetched
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Management
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadProfileData}
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
              <ImageWithFallback
                src={profileData?.photo || ''}
                alt={profileData?.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <Label>Photo URL</Label>
              <Input
                value={profileData?.photo || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    photo: e.target.value,
                  }))
                }
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a direct URL to your profile photo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={profileData?.name || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label>Professional Title</Label>
              <Input
                value={profileData?.title || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Role"
              />
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              value={profileData?.bio || ''}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              placeholder="Write a brief bio about yourself..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={profileData?.email || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="tantalks@gmail.com"
              />
            </div>
            <div>
              <Label>Education</Label>
              <Input
                value={profileData?.education || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    education: e.target.value,
                  }))
                }
                placeholder="Your Education"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Professional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Work Start Date</Label>
              <Input
                type="month"
                value={profileData?.workStartDate || '2021-01'}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    workStartDate: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Current experience:{" "}
                <strong>
                  {calculateExperience(
                    profileData?.workStartDate || '2021-01',
                  )}{" "}
                  years
                </strong>
              </p>
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input
                value={(profileData?.skills || []).join(", ")}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Data Science, Machine Learning, AI"
              />
            </div>
          </div>

          <div>
            <Label>Key Achievements</Label>
            <Textarea
              value={profileData?.achievements || ''}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  achievements: e.target.value,
                }))
              }
              placeholder="List your key professional achievements..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>LinkedIn URL (optional)</Label>
              <Input
                value={profileData?.linkedinUrl || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label>Twitter URL (optional)</Label>
              <Input
                value={profileData?.twitterUrl || ''}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    twitterUrl: e.target.value,
                  }))
                }
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Skills Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(profileData?.skills || []).map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveProfileData} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}