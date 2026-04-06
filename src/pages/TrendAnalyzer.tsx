import { useState } from "react";
import { TrendingUp, TrendingDown, Search, Calendar, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrendAnalyzer() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingStyles = [
    {
      name: "Y2K Revival",
      growth: "+145%",
      trend: "up",
      description: "Low-rise jeans, crop tops, and butterfly clips are making a comeback",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      popularity: 92,
    },
    {
      name: "Oversized Blazers",
      growth: "+89%",
      trend: "up",
      description: "Power dressing with an oversized, relaxed fit",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
      popularity: 85,
    },
    {
      name: "Chunky Sneakers",
      growth: "+67%",
      trend: "up",
      description: "Dad sneakers and platform styles dominating streetwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      popularity: 78,
    },
    {
      name: "Sustainable Fashion",
      growth: "+123%",
      trend: "up",
      description: "Eco-friendly materials and ethical production gaining momentum",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
      popularity: 88,
    },
  ];

  const colorTrends = [
    { name: "Sage Green", hex: "#9CAF88", popularity: 95 },
    { name: "Terracotta", hex: "#E07A5F", popularity: 88 },
    { name: "Lavender", hex: "#C8B6E2", popularity: 82 },
    { name: "Butter Yellow", hex: "#F4D35E", popularity: 76 },
    { name: "Dusty Rose", hex: "#D4A5A5", popularity: 71 },
    { name: "Navy Blue", hex: "#2C3E50", popularity: 68 },
  ];

  const upcomingTrends = [
    {
      name: "Maximalist Jewelry",
      timeframe: "Next 2-3 months",
      confidence: 87,
    },
    {
      name: "Cargo Pants Revival",
      timeframe: "Next 1-2 months",
      confidence: 92,
    },
    {
      name: "Sheer Fabrics",
      timeframe: "Next 3-4 months",
      confidence: 78,
    },
    {
      name: "Metallic Accents",
      timeframe: "Next 2-3 months",
      confidence: 85,
    },
  ];

  const regionalTrends = [
    { region: "North America", trend: "Athleisure & Comfort", growth: "+78%" },
    { region: "Europe", trend: "Minimalist Chic", growth: "+65%" },
    { region: "Asia", trend: "Streetwear Fusion", growth: "+112%" },
    { region: "South America", trend: "Bold Colors & Prints", growth: "+89%" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trend Analyzer</h1>
          <p className="text-muted-foreground">
            Real-time fashion trends and predictions powered by AI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Set Alerts
          </Button>
          <Button>
            <Globe className="w-4 h-4 mr-2" />
            Global View
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for trends, styles, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Trends</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        {/* Current Trends */}
        <TabsContent value="current" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingStyles.map((style) => (
              <Card key={style.name} className="overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        style.trend === "up"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {style.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 inline mr-1" />
                      )}
                      {style.growth}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{style.name}</CardTitle>
                  <CardDescription>{style.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Popularity</span>
                      <span className="font-medium">{style.popularity}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${style.popularity}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Trends */}
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTrends.map((trend) => (
              <Card key={trend.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{trend.name}</CardTitle>
                  <CardDescription>{trend.timeframe}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{trend.confidence}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${trend.confidence}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Color Trends */}
        <TabsContent value="colors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending Colors This Season</CardTitle>
              <CardDescription>
                Based on runway shows, social media, and retail data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {colorTrends.map((color) => (
                  <div key={color.name} className="text-center">
                    <div
                      className="color-swatch mx-auto mb-2"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="font-medium text-sm">{color.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {color.popularity}% popular
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Color Combinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#9CAF88" }} />
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#E07A5F" }} />
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#2C3E50" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Earth Tones Palette</p>
                    <p className="text-sm text-muted-foreground">
                      Perfect for autumn/winter collections
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#C8B6E2" }} />
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#F4D35E" }} />
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#D4A5A5" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Pastel Dreams</p>
                    <p className="text-sm text-muted-foreground">
                      Soft and romantic spring vibes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Trends */}
        <TabsContent value="regional" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalTrends.map((region) => (
              <Card key={region.region}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {region.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{region.trend}</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 font-medium">
                        {region.growth}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}