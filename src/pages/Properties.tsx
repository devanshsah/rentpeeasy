import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import {
  api, formatPrice, formatLocation,
  type PropertyDto, type PropertyType,
} from "@/lib/api";

// ── helpers ───────────────────────────────────────────────────────────────────

const PROPERTY_TYPES: PropertyType[] = ["PG", "ROOM", "APARTMENT", "FLAT", "VILLA", "COMMERCIAL"];

function toCardProps(p: PropertyDto) {
  return {
    id: p.id,
    title: p.title,
    location: formatLocation(p),
    price: `${formatPrice(p.price)}/${p.priceUnit ?? "month"}`,
    type: p.type,
    beds: p.beds ?? undefined,
    baths: p.baths ?? undefined,
    area: p.squareFeet ?? undefined,
    image: p.images?.[0] ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    verified: p.isVerified ?? false,
    featured: p.isFeatured ?? false,
    contactNumber: p.contactNumber,
  };
}

// ── component ─────────────────────────────────────────────────────────────────

const Properties = () => {
  const [searchParams] = useSearchParams();

  // Search state
  const [cityQuery, setCityQuery] = useState(searchParams.get("q") ?? "");
  const [localityQuery, setLocalityQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(() => {
    const t = searchParams.get("type");
    return t ? [t as PropertyType] : [];
  });
  const [priceRange, setPriceRange] = useState([5000, 100000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Data state
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── fetch ────────────────────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If multiple types selected, fetch all and filter client-side
      // (backend only supports one type at a time)
      const searchCity = cityQuery.trim() || localityQuery.trim() || undefined;
      const type = selectedTypes.length === 1 ? selectedTypes[0] : undefined;

      const data = await api.getProperties({
        city: searchCity,
        type,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });

      // Client-side filter for multiple types
      const filtered = selectedTypes.length > 1
          ? data.filter((p) => selectedTypes.includes(p.type))
          : data;

      setProperties(filtered);
    } catch {
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cityQuery, localityQuery, selectedTypes, priceRange]);

  // Initial fetch
  useEffect(() => { fetchProperties(); }, []);

  const handleTypeToggle = (type: PropertyType) => {
    setSelectedTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClear = () => {
    setCityQuery("");
    setLocalityQuery("");
    setSelectedTypes([]);
    setPriceRange([5000, 100000]);
  };

  const hasActiveFilters =
      cityQuery || localityQuery || selectedTypes.length > 0 ||
      priceRange[0] !== 5000 || priceRange[1] !== 100000;

  // ── sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          {hasActiveFilters && (
              <button
                  onClick={handleClear}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear
              </button>
          )}
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Location</h4>
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
                placeholder="e.g. Bangalore"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProperties()}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Locality / Area</label>
            <Input
                placeholder="e.g. Koramangala"
                value={localityQuery}
                onChange={(e) => setLocalityQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProperties()}
            />
          </div>
        </div>

        {/* Rent Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Rent Range</h4>
          <div className="px-1">
            <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000}
                min={5000}
                step={1000}
                className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Property Type</h4>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </label>
                </div>
            ))}
          </div>
        </div>

        <Button
            className="w-full bg-gradient-primary text-primary-foreground"
            onClick={fetchProperties}
            disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Search
        </Button>
      </div>
  );

  return (
      <div className="min-h-screen">
        <Header />

        {/* Hero search bar */}
        <section className="bg-gradient-hero py-10">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                Find Your <span className="text-primary">Perfect Property</span>
              </h1>
              <div className="bg-card rounded-xl p-4 shadow-large flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                      placeholder="Search by city, locality, or landmark..."
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchProperties()}
                      className="pl-10"
                  />
                </div>
                <Button
                    className="bg-gradient-primary text-primary-foreground px-6"
                    onClick={fetchProperties}
                    disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
                <Button
                    variant="outline"
                    className="md:hidden"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-soft sticky top-20">
                <Sidebar />
              </div>
            </aside>

            {/* Mobile filters */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 bg-background/80 md:hidden" onClick={() => setShowMobileFilters(false)}>
                  <div
                      className="absolute left-0 top-0 h-full w-80 bg-card p-6 shadow-large overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                  >
                    <Sidebar />
                  </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Properties</h2>
                  {!loading && (
                      <Badge variant="secondary">
                        {properties.length} found
                      </Badge>
                  )}
                  {selectedTypes.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {selectedTypes.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {t}
                              <button className="ml-1" onClick={() => handleTypeToggle(t)}>×</button>
                            </Badge>
                        ))}
                      </div>
                  )}
                </div>
              </div>

              {/* States */}
              {loading && (
                  <div className="flex justify-center items-center py-24">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
              )}

              {error && !loading && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg mb-4">{error}</p>
                    <Button variant="outline" onClick={fetchProperties}>Retry</Button>
                  </div>
              )}

              {!loading && !error && properties.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg mb-4">
                      No properties found. Try adjusting your filters.
                    </p>
                    <Button variant="outline" onClick={handleClear}>Clear Filters</Button>
                  </div>
              )}

              {!loading && !error && properties.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((p) => (
                        <PropertyCard key={p.id} {...toCardProps(p)} />
                    ))}
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