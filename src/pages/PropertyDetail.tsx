import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Bed, Bath, Square, CheckCircle2, Phone, MessageSquare, Share2, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { api, type Property } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getProperty(id)
        .then((data) => { setProperty(data); setLoading(false); })
        .catch(() => { setError("Property not found or could not be loaded."); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    api.getFavorites()
        .then((favs) => setIsFavorite(favs.some((f) => String(f.id) === id)))
        .catch(() => { });
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please sign in to save properties.", variant: "destructive" });
      return;
    }
    if (!id) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.removeFavorite(id);
        setIsFavorite(false);
        toast({ title: "Removed from saved properties" });
      } else {
        await api.addFavorite(id);
        setIsFavorite(true);
        toast({ title: "Saved to your favourites!" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) return (
      <div className="min-h-screen"><Header />
        <div className="flex justify-center items-center py-32"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        <Footer /></div>
  );

  if (error || !property) return (
      <div className="min-h-screen"><Header />
        <div className="container py-24 text-center">
          <p className="text-muted-foreground text-lg mb-6">{error ?? "Property not found."}</p>
          <Link to="/properties"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Properties</Button></Link>
        </div><Footer /></div>
  );

  const images = property.images && property.images.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"];
  const location = [property.locality, property.city].filter(Boolean).join(", ");

  return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-8">
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to Properties
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img src={images[currentImage]} alt={property.title} className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                          <button key={idx} onClick={() => setCurrentImage(idx)}
                                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${idx === currentImage ? "border-primary" : "border-transparent"}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                      ))}
                    </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {property.isVerified && <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>}
                  <Badge variant="secondary">{property.type}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
                {location && <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" />{location}</p>}
              </div>

              <Separator />

              <div className="flex flex-wrap gap-6">
                {property.beds != null && <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /><span>{property.beds} Bed{property.beds !== 1 ? "s" : ""}</span></div>}
                {property.baths != null && <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary" /><span>{property.baths} Bath{property.baths !== 1 ? "s" : ""}</span></div>}
                {property.squareFeet != null && <div className="flex items-center gap-2"><Square className="h-5 w-5 text-primary" /><span>{property.squareFeet.toLocaleString("en-IN")} sq.ft</span></div>}
              </div>

              <Separator />

              {property.description && (
                  <Card><CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">About this property</h2>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </CardContent></Card>
              )}

              {property.amenities && property.amenities.length > 0 && (
                  <Card><CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /><span>{amenity}</span>
                          </div>
                      ))}
                    </div>
                  </CardContent></Card>
              )}
            </div>

            <div className="lg:w-96 space-y-6">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">₹{property.price.toLocaleString("en-IN")}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                  <Separator />
                  <h3 className="font-semibold text-lg">Contact Owner</h3>
                  {property.contactNumber ? (
                      <>
                        <a href={`tel:${property.contactNumber}`}>
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90"><Phone className="h-4 w-4 mr-2" />Call Owner</Button>
                        </a>
                        <a href={`https://wa.me/${property.contactNumber.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full"><MessageSquare className="h-4 w-4 mr-2" />WhatsApp</Button>
                        </a>
                      </>
                  ) : (
                      <p className="text-sm text-muted-foreground">Contact details not available.</p>
                  )}
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleToggleFavorite} disabled={favoriteLoading}>
                      {favoriteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default PropertyDetail;