import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Home, Search, Settings, FileText, Info,
  User, LogOut, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostPropertyDialog from "./PostPropertyDialog";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/properties", label: "Properties", icon: Search },
  { path: "/services", label: "Services", icon: Settings },
  { path: "/about", label: "About", icon: Info },
  { path: "/news", label: "News", icon: FileText },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [postPropertyOpen, setPostPropertyOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Backend role is uppercase: OWNER, ADMIN, USER
  const isOwner = user?.role === "OWNER";
  const displayName = user?.fullName || user?.username || "";
  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
            <span className="text-2xl font-bold text-primary">RentPeRazi</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.path) ? "text-primary font-semibold" : "text-foreground/70"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
            ))}
          </nav>

          {/* Desktop auth actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
                <>
                  {/* Post Property button — green, visible only to owners */}
                  {isOwner && (
                      <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => setPostPropertyOpen(true)}
                      >
                        Post Property
                      </Button>
                  )}

                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={displayName}
                            className="w-7 h-7 rounded-full object-cover border border-primary/30"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">{initial}</span>
                          </div>
                        )}
                        <span className="text-sm">{displayName.split(" ")[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="h-4 w-4 mr-2" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
            ) : (
                <>
                  <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
                </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
            <div className="border-t bg-background/95 backdrop-blur md:hidden">
              <nav className="container py-4 space-y-3">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                            isActive(item.path) ? "text-primary font-semibold" : "text-foreground/70"
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                ))}

                <div className="pt-4 space-y-2 border-t">
                  {isAuthenticated && user ? (
                      <>
                        {isOwner && (
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 text-white"
                                size="sm"
                                onClick={() => { setPostPropertyOpen(true); setIsMenuOpen(false); }}
                            >
                              Post Property
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="w-full justify-start"
                                onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}>
                          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start"
                                onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}>
                          <User className="h-4 w-4 mr-2" /> Profile
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-destructive"
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                      </>
                  ) : (
                      <>
                        <Button variant="outline" size="sm"
                                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>
                          Login
                        </Button>
                        <Button
                            size="sm"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => { navigate("/register"); setIsMenuOpen(false); }}
                        >
                          Sign Up
                        </Button>
                      </>
                  )}
                </div>
              </nav>
            </div>
        )}

        <PostPropertyDialog open={postPropertyOpen} onOpenChange={setPostPropertyOpen} />
      </header>
  );
};

export default Header;