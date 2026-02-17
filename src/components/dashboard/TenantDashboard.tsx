import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoUser } from "@/contexts/AuthContext";
import { Heart, Eye, Clock, MapPin, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TenantDashboard = ({ user }: { user: DemoUser }) => {
  const savedProperties = [
    { id: "1", title: "Modern 2BHK in Koramangala", price: "₹25,000/mo", location: "Koramangala, Bangalore", status: "Available" },
    { id: "3", title: "3BHK Villa in Whitefield", price: "₹45,000/mo", location: "Whitefield, Bangalore", status: "Available" },
  ];

  const recentViews = [
    { id: "1", title: "Modern 2BHK in Koramangala", price: "₹25,000/mo", viewedAt: "Today" },
    { id: "2", title: "Luxury PG in HSR Layout", price: "₹12,000/mo", viewedAt: "Yesterday" },
    { id: "4", title: "Furnished 1BHK Near Metro", price: "₹18,000/mo", viewedAt: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Find your perfect rental home</p>
        </div>
        <Link to="/properties">
          <Button className="bg-gradient-primary text-primary-foreground">
            <Search className="h-4 w-4 mr-2" /> Browse Properties
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Saved Properties", value: "2", icon: Heart },
          { label: "Recently Viewed", value: "3", icon: Eye },
          { label: "Inquiries Sent", value: "5", icon: Clock },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary-lightest rounded-lg">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saved Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Saved Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedProperties.map((prop) => (
              <Link key={prop.id} to={`/property/${prop.id}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <h4 className="font-medium">{prop.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {prop.location}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">{prop.price}</span>
                  <Badge>{prop.status}</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Viewed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Recently Viewed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentViews.map((prop) => (
              <Link key={prop.id} to={`/property/${prop.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <h4 className="font-medium text-sm">{prop.title}</h4>
                  <p className="text-sm font-semibold text-primary">{prop.price}</p>
                </div>
                <span className="text-xs text-muted-foreground">{prop.viewedAt}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboard;
