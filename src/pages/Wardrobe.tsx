import { useState } from "react";
import { Plus, Search, Filter, Grid, List, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WardrobeItem {
  id: number;
  name: string;
  category: string;
  color: string;
  brand: string;
  image: string;
  tags: string[];
}

export default function Wardrobe() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample wardrobe items
  const wardrobeItems: WardrobeItem[] = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      category: "tops",
      color: "White",
      brand: "Uniqlo",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      tags: ["casual", "basic", "summer"],
    },
    {
      id: 2,
      name: "Black Leather Jacket",
      category: "outerwear",
      color: "Black",
      brand: "AllSaints",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      tags: ["edgy", "winter", "statement"],
    },
    {
      id: 3,
      name: "Blue Denim Jeans",
      category: "bottoms",
      color: "Blue",
      brand: "Levi's",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      tags: ["casual", "versatile", "classic"],
    },
    {
      id: 4,
      name: "White Sneakers",
      category: "shoes",
      color: "White",
      brand: "Nike",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      tags: ["casual", "comfortable", "trendy"],
    },
    {
      id: 5,
      name: "Floral Summer Dress",
      category: "dresses",
      color: "Multi",
      brand: "Zara",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      tags: ["feminine", "summer", "casual"],
    },
    {
      id: 6,
      name: "Black Ankle Boots",
      category: "shoes",
      color: "Black",
      brand: "Dr. Martens",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
      tags: ["edgy", "winter", "versatile"],
    },
  ];

  const categories = [
    { value: "all", label: "All Items" },
    { value: "tops", label: "Tops" },
    { value: "bottoms", label: "Bottoms" },
    { value: "dresses", label: "Dresses" },
    { value: "outerwear", label: "Outerwear" },
    { value: "shoes", label: "Shoes" },
    { value: "accessories", label: "Accessories" },
  ];

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Wardrobe</h1>
          <p className="text-muted-foreground">
            Manage your fashion collection
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Items
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Manually
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, brand, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wardrobe Items */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({wardrobeItems.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {viewMode === "grid" ? (
            <div className="fashion-grid">
              {filteredItems.map((item) => (
                <Card key={item.id} className="fashion-card overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.brand} • {item.color}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span key={tag} className="style-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use in Outfit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No items found</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No favorite items yet</p>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recently added items</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}