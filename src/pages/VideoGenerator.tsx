import { useState } from "react";
import { Video, Wand2, Download, Play, Settings, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate video generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const examplePrompts = [
    "A fashion model walking down a neon-lit runway in futuristic streetwear",
    "Close-up of luxury sneakers rotating on a pedestal with dramatic lighting",
    "Time-lapse of a designer creating a haute couture dress",
    "Fashion photoshoot in an urban setting with graffiti walls",
  ];

  const recentVideos = [
    {
      id: 1,
      title: "Summer Collection Showcase",
      thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      duration: "0:45",
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Sneaker Rotation 360°",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      duration: "0:30",
      date: "1 day ago",
    },
    {
      id: 3,
      title: "Streetwear Lookbook",
      thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
      duration: "1:20",
      date: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Video className="w-8 h-8" />
            AI Video Generator
          </h1>
          <p className="text-muted-foreground">
            Create stunning fashion videos with Sora 2 AI Engine
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Video</CardTitle>
              <CardDescription>
                Describe your vision and let AI bring it to life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Video Prompt</Label>
                <Textarea
                  placeholder="Describe the fashion video you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about style, setting, lighting, and movement
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <select className="w-full p-2 rounded-md border bg-background">
                    <option>5 seconds</option>
                    <option>10 seconds</option>
                    <option>15 seconds</option>
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <select className="w-full p-2 rounded-md border bg-background">
                    <option>720p</option>
                    <option>1080p (HD)</option>
                    <option>1440p (2K)</option>
                    <option>2160p (4K)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Style Preset</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>Cinematic</option>
                  <option>Fashion Editorial</option>
                  <option>Streetwear</option>
                  <option>Luxury</option>
                  <option>Minimalist</option>
                  <option>Vintage</option>
                </select>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Generating...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Video"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center">
                {progress === 100 ? (
                  <div className="text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-white mb-4">Video generated successfully!</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="secondary">
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      <Button variant="secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your generated video will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Example Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Example Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left h-auto py-3 px-4 whitespace-normal"
                  onClick={() => setPrompt(example)}
                >
                  <span className="text-sm">{example}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>Sora 2 (Latest)</option>
                  <option>Sora 1</option>
                  <option>Runway Gen-2</option>
                  <option>Stable Video</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Frame Rate</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>24 FPS (Cinematic)</option>
                  <option>30 FPS (Standard)</option>
                  <option>60 FPS (Smooth)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>16:9 (Landscape)</option>
                  <option>9:16 (Portrait)</option>
                  <option>1:1 (Square)</option>
                  <option>4:5 (Instagram)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Videos Generated</span>
                    <span className="font-medium">12 / 50</span>
                  </div>
                  <Progress value={24} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total Duration</span>
                    <span className="font-medium">8:45 / 30:00</span>
                  </div>
                  <Progress value={29} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your previously generated videos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}