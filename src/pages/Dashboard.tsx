import { useState, useEffect } from "react";
import {
  Shirt,
  Palette,
  Box,
  TrendingUp,
  Video,
  Sparkles,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [stats, setStats] = useState({
    wardrobeItems: 0,
    outfitsCreated: 0,
    projectsInProgress: 0,
    videosGenerated: 0,
  });

  useEffect(() => {
    // Load stats from storage
    // This would connect to your Tauri backend
    setStats({
      wardrobeItems: 42,
      outfitsCreated: 18,
      projectsInProgress: 3,
      videosGenerated: 7,
    });
  }, []);

  const quickActions = [
    {
      title: "Create New Outfit",
      description: "Mix and match from your wardrobe",
      icon: Palette,
      href: "/style-creator",
      color: "text-purple-500",
    },
    {
      title: "3D Animation",
      description: "Start a new 3D project",
      icon: Box,
      href: "/3d-studio",
      color: "text-blue-500",
    },
    {
      title: "Generate Video",
      description: "Create AI-powered fashion videos",
      icon: Video,
      href: "/video-generator",
      color: "text-pink-500",
    },
    {
      title: "AI Styling",
      description: "Get personalized recommendations",
      icon: Sparkles,
      href: "/ai-assistant",
      color: "text-yellow-500",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Summer Collection 2024",
      type: "3D Animation",
      progress: 75,
      thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
    },
    {
      id: 2,
      name: "Streetwear Lookbook",
      type: "Video",
      progress: 45,
      thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
    },
    {
      id: 3,
      name: "Sneaker Showcase",
      type: "Style Board",
      progress: 90,
      thumbnail: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to FashionForge Studio</h1>
        <p className="text-lg opacity-90">
          Your ultimate fashion design and animation platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wardrobe Items</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wardrobeItems}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outfits Created</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outfitsCreated}</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsInProgress}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Generated</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videosGenerated}</div>
            <p className="text-xs text-muted-foreground">+2 today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <Icon className={`w-8 h-8 mb-2 ${action.color}`} />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="w-full">
                      Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>{project.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Continue Working
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Styles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending This Week
          </CardTitle>
          <CardDescription>
            Popular styles and trends in the fashion community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Y2K Revival",
              "Oversized Blazers",
              "Chunky Sneakers",
              "Neon Accents",
              "Vintage Denim",
              "Minimalist Chic",
              "Athleisure",
              "Sustainable Fashion",
            ].map((trend) => (
              <span key={trend} className="style-tag">
                {trend}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}