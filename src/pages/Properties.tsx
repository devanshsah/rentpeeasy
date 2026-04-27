import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { api, type Property } from "@/lib/api";

function formatPrice(price: number | undefined): string {
  if (!price) return "Price on request";
  return `₹${price.toLocaleString("en-IN")}/month`;
}

function toPropertyCardProps(p: Property) {
  return {
    id: String(p.id),
    title: p.title,
    location: [p.locality, p.city].filter(Boolean).join(", "),
    price: formatPrice(p.price),
    type: p.type,
    beds: p.beds,
    baths: p.baths,
    area: p.squareFeet,
    image: p.images?.[0] ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    verified: p.verified ?? true,
    featured: p.featured,
  };
}

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") ?? "all");
  const [priceRange, setPriceRange] = useState([5000, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setError(null);
    api.getProperties({
      city: searchQuery.trim() || undefined,
      type: propertyType !== "all" ? propertyType : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    })
        .then(setProperties)
        .catch(() => setError("Failed to load properties. Please try again."))
        .finally(() => setLoading(false));
  }, [searchQuery, propertyType, priceRange]);

  useEffect(() => { fetchProperties(); }, []);

  const handleClear = () => {
    setSearchQuery("");
    setPropertyType("all");
    setPriceRange([5000, 100000]);
    setTimeout(fetchProperties, 0);
  };

  return (
      <div className="min-h-screen">
        <Header />

        <section className="bg-gradient-hero py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your <span className="text-primary">Perfect Property</span></h1>
                {!loading && <p className="text-muted-foreground text-lg">{properties.length} propert{properties.length === 1 ? "y" : "ies"} found</p>}
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-large">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by city, locality, or landmark..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchProperties()}
                        className="pl-10"
                    />
                  </div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="md:w-48"><SelectValue placeholder="Property Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="PG">PG / Hostel</SelectItem>
                      <SelectItem value="ROOM">Room</SelectItem>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="FLAT">Flat</SelectItem>
                      <SelectItem value="VILLA">Villa</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />Filters
                  </Button>
                  <Button className="bg-gradient-primary text-primary-foreground" onClick={fetchProperties} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-80 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Filter className="h-4 w-4" />Filters</h3>
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium">Price Range</h4>
                  <div className="px-2">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={100000} min={5000} step={1000} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                      <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Property Type</h4>
                  {["PG", "ROOM", "APARTMENT", "FLAT", "VILLA", "COMMERCIAL"].map((type) => (
                      <button key={type} onClick={() => setPropertyType(propertyType === type ? "all" : type)}
                              className={`flex items-center w-full text-left px-2 py-1 rounded text-sm transition-colors ${propertyType === type ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                        <span className={`mr-2 w-3 h-3 rounded border ${propertyType === type ? "bg-primary border-primary" : "border-muted-foreground"}`} />
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </button>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6" onClick={handleClear}>Clear All Filters</Button>
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Properties</h2>
                  {!loading && <Badge variant="secondary">{properties.length} found</Badge>}
                </div>
              </div>

              {loading && <div className="flex justify-center items-center py-24"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}
              {error && !loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchProperties}>Retry</Button>
                  </div>
              )}
              {!loading && !error && properties.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                    <Button variant="outline" className="mt-4" onClick={handleClear}>Clear Filters</Button>
                  </div>
              )}
              {!loading && !error && properties.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((property) => <PropertyCard key={property.id} {...toPropertyCardProps(property)} />)}
                  </div>
              )}
            </main>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default Properties;