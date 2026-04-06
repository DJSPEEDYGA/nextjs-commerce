import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Wardrobe from "@/pages/Wardrobe";
import StyleCreator from "@/pages/StyleCreator";
import Studio3D from "@/pages/Studio3D";
import AIAssistant from "@/pages/AIAssistant";
import TrendAnalyzer from "@/pages/TrendAnalyzer";
import VideoGenerator from "@/pages/VideoGenerator";
import Settings from "@/pages/Settings";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/style-creator" element={<StyleCreator />} />
          <Route path="/3d-studio" element={<Studio3D />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/trends" element={<TrendAnalyzer />} />
          <Route path="/video-generator" element={<VideoGenerator />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;