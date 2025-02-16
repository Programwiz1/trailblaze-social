
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { SignUpDialog } from "@/components/SignUpDialog";
import { LoginDialog } from "@/components/LoginDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-nature-600">
              TrailBuddy
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/social" className="text-gray-600 hover:text-nature-600">
                Community
              </Link>
              <Link to="/donate" className="text-gray-600 hover:text-nature-600">
                Donate
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-nature-600"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <LoginDialog />
                <SignUpDialog />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
