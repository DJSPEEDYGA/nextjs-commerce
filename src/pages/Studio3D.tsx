import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Download,
  Settings,
  Lightbulb,
  Box,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simple 3D Model Component
function Model() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial
        color={hovered ? "#8b5cf6" : "#6366f1"}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

// Mannequin placeholder
function Mannequin() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1.5, 32]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.7, 1.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.7, 1.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.25, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 1.2, 16]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.25, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 1.2, 16]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
}

export default function Studio3D() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightIntensity, setLightIntensity] = useState([1]);
  const [cameraFov, setCameraFov] = useState([50]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">3D Animation Studio</h1>
          <p className="text-muted-foreground">
            Create stunning 4K fashion animations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export 4K
          </Button>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Render
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Viewport */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Viewport</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] bg-gradient-to-b from-slate-900 to-slate-800">
                <Canvas shadows>
                  <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={cameraFov[0]} />
                    <OrbitControls enableDamping dampingFactor={0.05} />
                    
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <directionalLight
                      position={[10, 10, 5]}
                      intensity={lightIntensity[0]}
                      castShadow
                    />
                    <pointLight position={[-10, 10, -5]} intensity={0.5} />
                    
                    {/* Scene */}
                    <Mannequin />
                    <Grid
                      args={[20, 20]}
                      cellSize={1}
                      cellThickness={0.5}
                      cellColor="#6b7280"
                      sectionSize={5}
                      sectionThickness={1}
                      sectionColor="#9ca3af"
                      fadeDistance={30}
                      fadeStrength={1}
                      followCamera={false}
                    />
                    
                    {/* Environment */}
                    <Environment preset="studio" />
                  </Suspense>
                </Canvas>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Animation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="timeline-track">
                <div className="timeline-keyframe" style={{ left: "10%" }} />
                <div className="timeline-keyframe" style={{ left: "30%" }} />
                <div className="timeline-keyframe" style={{ left: "60%" }} />
                <div className="timeline-keyframe" style={{ left: "90%" }} />
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">0:00</span>
                <span className="text-sm text-muted-foreground">0:10</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scene Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lighting" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="lighting" className="flex-1">
                    <Lightbulb className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="camera" className="flex-1">
                    <Camera className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="objects" className="flex-1">
                    <Box className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="lighting" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Light Intensity</Label>
                    <Slider
                      value={lightIntensity}
                      onValueChange={setLightIntensity}
                      min={0}
                      max={3}
                      step={0.1}
                    />
                    <span className="text-xs text-muted-foreground">
                      {lightIntensity[0].toFixed(1)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>Shadow Quality</Label>
                    <select className="w-full p-2 rounded-md border bg-background">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Ultra</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="camera" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Field of View</Label>
                    <Slider
                      value={cameraFov}
                      onValueChange={setCameraFov}
                      min={20}
                      max={120}
                      step={1}
                    />
                    <span className="text-xs text-muted-foreground">
                      {cameraFov[0]}°
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>Camera Preset</Label>
                    <select className="w-full p-2 rounded-md border bg-background">
                      <option>Front View</option>
                      <option>Side View</option>
                      <option>Top View</option>
                      <option>Perspective</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="objects" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <select className="w-full p-2 rounded-md border bg-background">
                      <option>Mannequin</option>
                      <option>Male Model</option>
                      <option>Female Model</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Box className="w-4 h-4 mr-2" />
                    Import 3D Model
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Render Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Resolution</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>1080p (Full HD)</option>
                  <option>1440p (2K)</option>
                  <option>2160p (4K)</option>
                  <option>4320p (8K)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Frame Rate</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>24 FPS</option>
                  <option>30 FPS</option>
                  <option>60 FPS</option>
                  <option>120 FPS</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Quality</Label>
                <select className="w-full p-2 rounded-md border bg-background">
                  <option>Draft</option>
                  <option>Preview</option>
                  <option>Production</option>
                  <option>Ultra</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Scene Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Add Camera
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lightbulb className="w-4 h-4 mr-2" />
                Add Light
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}