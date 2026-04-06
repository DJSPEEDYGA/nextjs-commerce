import { useState } from "react";
import { Save, User, Palette, Bell, Shield, Database, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [settings, setSettings] = useState({
    name: "Fashion Designer",
    email: "designer@fashionforge.com",
    theme: "system",
    notifications: true,
    autoSave: true,
    aiModel: "gpt-4",
    renderQuality: "high",
  });

  const handleSave = () => {
    // Save settings logic
    console.log("Settings saved:", settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your FashionForge Studio experience
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Zap className="w-4 h-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full p-2 rounded-md border bg-background min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how FashionForge Studio looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <select
                  className="w-full p-2 rounded-md border bg-background"
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  {["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"].map(
                    (color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-primary transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Trend Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new fashion trends
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI Suggestions</p>
                  <p className="text-sm text-muted-foreground">
                    Receive AI-powered style recommendations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Render Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when 3D renders are complete
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI models and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <select
                  className="w-full p-2 rounded-md border bg-background"
                  value={settings.aiModel}
                  onChange={(e) =>
                    setSettings({ ...settings, aiModel: e.target.value })
                  }
                >
                  <option value="gpt-4">GPT-4 (Recommended)</option>
                  <option value="gpt-3.5">GPT-3.5 Turbo</option>
                  <option value="claude">Claude 3</option>
                  <option value="local">Local Model</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input type="password" placeholder="sk-..." />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored securely and never shared
                </p>
              </div>
              <div className="space-y-2">
                <Label>Replicate API Key</Label>
                <Input type="password" placeholder="r8_..." />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Save</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your work
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoSave: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>
                Optimize performance for your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Render Quality</Label>
                <select
                  className="w-full p-2 rounded-md border bg-background"
                  value={settings.renderQuality}
                  onChange={(e) =>
                    setSettings({ ...settings, renderQuality: e.target.value })
                  }
                >
                  <option value="low">Low (Faster)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Recommended)</option>
                  <option value="ultra">Ultra (Slower)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Cache Size</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>500 MB</option>
                  <option>1 GB</option>
                  <option>2 GB</option>
                  <option>5 GB</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your privacy and data settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app by sharing usage data
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cloud Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Sync your data across devices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Data Storage</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Local Storage</p>
                      <p className="text-sm text-muted-foreground">
                        2.4 GB used of 10 GB
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Clear Cache
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Delete All Data
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  This action cannot be undone
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}