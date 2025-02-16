
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Social from "@/pages/Social";
import TrailDetail from "@/pages/TrailDetail";
import Donate from "@/pages/Donate";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/social" element={<Social />} />
          <Route path="/trail/:id" element={<TrailDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
