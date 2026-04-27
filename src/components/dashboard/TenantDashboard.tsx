import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppUser } from "@/contexts/AuthContext";
import { Heart, Eye, MapPin, Search, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, type Property } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}/mo`;
}

const TenantDashboard = ({ user }: { user: AppUser }) => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    setFavLoading(true);
    api.getFavorites()
        .then(setFavorites)
        .catch(() => toast({ title: "Could not load saved properties", variant: "destructive" }))
        .finally(() => setFavLoading(false));
  }, []);

  const handleRemoveFavorite = async (propertyId: string | number) => {
    try {
      await api.removeFavorite(propertyId);
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
      toast({ title: "Removed from saved properties" });
    } catch {
      toast({ title: "Could not remove property", variant: "destructive" });
    }
  };

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Find your perfect rental home</p>
          </div>
          <Link to="/properties">
            <Button className="bg-gradient-primary text-primary-foreground">
              <Search className="h-4 w-4 mr-2" />Browse Properties
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Saved Properties", value: favLoading ? "…" : String(favorites.length), icon: Heart },
            { label: "Browse Listings", value: "→", icon: Eye },
          ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-primary-lightest rounded-lg"><stat.icon className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" />Saved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {favLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't saved any properties yet.</p>
                  <Link to="/properties"><Button variant="outline" size="sm">Browse Properties</Button></Link>
                </div>
            ) : (
                <div className="space-y-3">
                  {favorites.map((prop) => (
                      <div key={prop.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <Link to={`/property/${prop.id}`} className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{prop.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {[prop.locality, prop.city].filter(Boolean).join(", ")}
                          </p>
                        </Link>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="font-semibold text-primary whitespace-nowrap">{formatPrice(prop.price)}</span>
                          <Badge>Available</Badge>
                          <button onClick={() => handleRemoveFavorite(prop.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                          </button>
                          <Link to={`/property/${prop.id}`}><ArrowRight className="h-4 w-4 text-muted-foreground" /></Link>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default TenantDashboard;