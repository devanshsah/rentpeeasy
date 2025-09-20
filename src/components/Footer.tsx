import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
              <span className="text-2xl font-bold text-primary">RentEasy</span>
            </div>
            <p className="text-muted-foreground">
              Your trusted partner in finding the perfect rental property across India.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/properties" className="block text-muted-foreground hover:text-primary transition-colors">
                Properties
              </Link>
              <Link to="/services" className="block text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/news" className="block text-muted-foreground hover:text-primary transition-colors">
                News & Articles
              </Link>
            </div>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h3 className="font-semibold">Property Types</h3>
            <div className="space-y-2">
              <div className="text-muted-foreground">PG & Hostels</div>
              <div className="text-muted-foreground">Single Rooms</div>
              <div className="text-muted-foreground">Flats & Apartments</div>
              <div className="text-muted-foreground">Commercial Spaces</div>
              <div className="text-muted-foreground">Villas & Houses</div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@renteasy.com</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1" />
                <span>123 Tech Park, Bangalore, Karnataka 560001</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Newsletter</h4>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © 2024 RentEasy. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;