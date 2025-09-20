import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, Settings, FileText, Info } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/properties", label: "Properties", icon: Search },
    { path: "/services", label: "Services", icon: Settings },
    { path: "/about", label: "About", icon: Info },
    { path: "/news", label: "News", icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
          <span className="text-2xl font-bold text-primary">RentEasy</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-soft">
            Post Property
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-background/95 backdrop-blur md:hidden">
          <nav className="container py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Login
              </Button>
              <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground shadow-soft">
                Post Property
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;