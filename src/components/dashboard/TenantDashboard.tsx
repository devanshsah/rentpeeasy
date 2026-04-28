import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppUser } from "@/contexts/AuthContext";
import { Heart, Search, MapPin, ArrowRight, Loader2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { api, formatPrice, formatLocation, type PropertyDto } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const TenantDashboard = ({ user }: { user: AppUser }) => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
        .getFavorites()
        .then(setFavorites)
        .catch(() => toast({ title: "Could not load saved properties", variant: "destructive" }))
        .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await api.removeFavorite(id);
      setFavorites((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Removed from saved properties" });
    } catch {
      toast({ title: "Could not remove property", variant: "destructive" });
    }
  };

  return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user.fullName || user.username}
            </h1>
            <p className="text-muted-foreground">Find your perfect rental home</p>
          </div>
          <Link to="/properties">
            <Button className="bg-gradient-primary text-primary-foreground">
              <Search className="h-4 w-4 mr-2" /> Browse Properties
            </Button>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "Saved Properties",
              value: loading ? "…" : String(favorites.length),
              icon: Heart,
            },
            { label: "Browse Listings", value: "→", icon: Home },
            { label: "Zero Brokerage", value: "✓", icon: Search },
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
            {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No saved properties yet.</p>
                  <Link to="/properties">
                    <Button variant="outline" size="sm">Browse Properties</Button>
                  </Link>
                </div>
            ) : (
                <div className="space-y-3">
                  {favorites.map((p) => (
                      <div
                          key={p.id}
                          className="flex items-center justify-between p-4 bg-muted/40 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        {/* Image thumbnail */}
                        {p.images?.[0] && (
                            <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-14 h-12 object-cover rounded-md flex-shrink-0 mr-3"
                            />
                        )}

                        <Link to={`/property/${p.id}`} className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{p.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {formatLocation(p)}
                          </p>
                        </Link>

                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="font-semibold text-primary text-sm whitespace-nowrap">
                      {formatPrice(p.price)}/mo
                    </span>
                          <Badge variant="secondary" className="text-xs">
                            {p.status ?? "Available"}
                          </Badge>
                          <button
                              onClick={() => handleRemove(p.id)}
                              title="Remove from saved"
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                          </button>
                          <Link to={`/property/${p.id}`}>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
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