import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Image, Palette, TrendingUp, Shirt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your AI Fashion Assistant. I can help you with style recommendations, outfit suggestions, trend analysis, and creative ideas. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("outfit") || lowerInput.includes("style")) {
      return "Based on current trends, I'd recommend a layered look with a classic white tee, oversized blazer, and high-waisted jeans. This combination is versatile and can be dressed up or down. Would you like specific brand recommendations or color palette suggestions?";
    } else if (lowerInput.includes("color")) {
      return "For this season, earth tones are trending! Consider incorporating warm browns, sage greens, and terracotta into your wardrobe. These colors pair beautifully with neutrals and create a sophisticated, modern look.";
    } else if (lowerInput.includes("trend")) {
      return "The top fashion trends right now include: Y2K revival with low-rise jeans and crop tops, oversized blazers for a power dressing aesthetic, chunky sneakers for comfort meets style, and sustainable fashion choices. Which trend interests you most?";
    } else if (lowerInput.includes("sneaker")) {
      return "Sneakers are having a major moment! Chunky dad sneakers, retro runners, and minimalist white sneakers are all popular. For streetwear, I'd recommend high-top sneakers in bold colors. For a more refined look, go with clean white leather sneakers.";
    } else {
      return "That's an interesting question! I can help you with outfit suggestions, color combinations, trend analysis, and style recommendations. Could you tell me more about what you're looking for? Are you planning for a specific occasion or just updating your everyday style?";
    }
  };

  const quickPrompts = [
    {
      icon: Shirt,
      text: "Suggest an outfit for today",
      prompt: "Can you suggest a stylish outfit for today?",
    },
    {
      icon: Palette,
      text: "Color palette ideas",
      prompt: "What color palettes are trending this season?",
    },
    {
      icon: TrendingUp,
      text: "Latest fashion trends",
      prompt: "What are the latest fashion trends?",
    },
    {
      icon: Image,
      text: "Style inspiration",
      prompt: "Give me some style inspiration for streetwear",
    },
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Fashion Assistant
          </h1>
          <p className="text-muted-foreground">
            Your personal AI stylist powered by advanced language models
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${message.role}`}
                    >
                      <div className="flex items-start gap-3">
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="chat-message assistant">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <span
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <span
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about fashion..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend} disabled={!input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {prompt.text}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What I Can Do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Personalized outfit recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Color palette suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Fashion trend analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Style advice for any occasion</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Brand and product recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Wardrobe organization tips</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>GPT-4 (Recommended)</option>
                  <option>GPT-3.5 Turbo</option>
                  <option>Claude 3</option>
                  <option>Local Model</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Style</label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>Detailed</option>
                  <option>Concise</option>
                  <option>Creative</option>
                  <option>Professional</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}