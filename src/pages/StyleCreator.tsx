import { useState } from "react";
import { Plus, Save, Share2, Wand2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OutfitItem {
  id: number;
  name: string;
  category: string;
  image: string;
  position: { x: number; y: number };
}

export default function StyleCreator() {
  const [outfitName, setOutfitName] = useState("Untitled Outfit");
  const [selectedItems, setSelectedItems] = useState<OutfitItem[]>([]);

  const availableItems = [
    {
      id: 1,
      name: "White T-Shirt",
      category: "tops",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
    {
      id: 2,
      name: "Black Jacket",
      category: "outerwear",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200",
    },
    {
      id: 3,
      name: "Blue Jeans",
      category: "bottoms",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200",
    },
    {
      id: 4,
      name: "White Sneakers",
      category: "shoes",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200",
    },
  ];

  const addToOutfit = (item: typeof availableItems[0]) => {
    const newItem: OutfitItem = {
      ...item,
      position: { x: 50, y: 50 },
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const removeFromOutfit = (id: number) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Style Creator</h1>
          <p className="text-muted-foreground">
            Mix and match to create the perfect outfit
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Outfit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <Input
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                  />
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Suggest
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-[450px] bg-gradient-to-b from-muted/50 to-muted rounded-lg border-2 border-dashed border-border overflow-hidden">
                {selectedItems.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Drag items here to create your outfit
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="absolute cursor-move group"
                        style={{
                          left: `${item.position.x}%`,
                          top: `${item.position.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 object-cover rounded-lg shadow-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromOutfit(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Panel */}
        <div>
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Wardrobe Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="tops" className="flex-1">
                    Tops
                  </TabsTrigger>
                  <TabsTrigger value="bottoms" className="flex-1">
                    Bottoms
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-3 max-h-[420px] overflow-y-auto">
                    {availableItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => addToOutfit(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {item.category}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tops">
                  <div className="space-y-3 max-h-[420px] overflow-y-auto">
                    {availableItems
                      .filter((item) => item.category === "tops")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => addToOutfit(item)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {item.category}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-muted-foreground" />
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="bottoms">
                  <div className="space-y-3 max-h-[420px] overflow-y-auto">
                    {availableItems
                      .filter((item) => item.category === "bottoms")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => addToOutfit(item)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {item.category}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-muted-foreground" />
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Style Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Casual Chic", "Street Style", "Business Casual", "Evening Wear"].map(
              (style) => (
                <Button key={style} variant="outline" className="h-auto py-4">
                  <div className="text-center">
                    <p className="font-medium">{style}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to apply
                    </p>
                  </div>
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}