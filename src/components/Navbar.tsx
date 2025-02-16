
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Mountain, Heart, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpDialog } from "@/components/SignUpDialog";
import { useAuth } from "@/lib/auth-context";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [signUpOpen, setSignUpOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Mountain className="w-6 h-6 text-nature-600" />
            <span className="text-xl font-semibold text-nature-800">TrailBlaze</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isActive("/") ? "text-nature-600" : "text-gray-600 hover:text-nature-500"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>
            
            <Link
              to="/social"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isActive("/social") ? "text-nature-600" : "text-gray-600 hover:text-nature-500"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Social</span>
            </Link>
            
            <Link
              to="/donate"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isActive("/donate") ? "text-nature-600" : "text-gray-600 hover:text-nature-500"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-nature-600 border-nature-600 hover:bg-nature-50"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setSignUpOpen(true)}
                className="bg-nature-600 hover:bg-nature-700 text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
      <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
    </nav>
  );
};

export default Navbar;
