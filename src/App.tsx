import { Routes, Route } from "react-router-dom";
import { HomeScreen } from "@/screens/HomeScreen";
import { ScanScreen } from "@/screens/ScanScreen";
import { RoomViewScreen } from "@/screens/RoomViewScreen";
import { ColourScreen } from "@/screens/ColourScreen";
import { QuoteScreen } from "@/screens/QuoteScreen";
import { ClientPreviewScreen } from "@/screens/ClientPreviewScreen";
import { ProjectsScreen } from "@/screens/ProjectsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-pv-bg">
      <div className="mx-auto min-h-[100dvh] max-w-md shadow-[0_0_80px_rgba(31,35,40,0.08)] lg:my-4 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[32px] lg:border lg:border-pv-border">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/room/:id" element={<RoomViewScreen />} />
          <Route path="/colour/:id" element={<ColourScreen />} />
          <Route path="/quote/:id" element={<QuoteScreen />} />
          <Route path="/client-preview/:id" element={<ClientPreviewScreen />} />
          <Route path="/projects" element={<ProjectsScreen />} />
          <Route path="/quotes" element={<ProjectsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </div>
  );
}
