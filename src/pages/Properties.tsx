import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Search, Loader2, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { api, formatPrice, formatLocation, type PropertyDto, type PropertyType } from "@/lib/api";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "PG", label: "PG / Hostel" },
  { value: "ROOM", label: "Private Room" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "FLAT", label: "Flat" },
  { value: "VILLA", label: "Villa" },
  { value: "COMMERCIAL", label: "Commercial" },
];

const BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

function toCardProps(p: PropertyDto) {
  return {
    id: p.id,
    title: p.title,
    location: formatLocation(p),
    price: formatPrice(p.price),
    type: p.type,
    beds: p.beds ?? undefined,
    baths: p.baths ?? undefined,
    area: p.squareFeet ?? undefined,
    images: p.images?.length ? p.images : undefined,
    image: p.images?.[0] ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
    verified: p.isVerified ?? false,
    featured: p.isFeatured ?? false,
    contactNumber: p.contactNumber,
    ownerName: p.ownerName,
    amenities: p.amenities ?? [],
  };
}

const Properties = () => {
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(() => {
    const t = searchParams.get("type");
    return t ? [t as PropertyType] : [];
  });
  const [selectedBhk, setSelectedBhk] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([5000, 100000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc">("relevance");

  const [openSections, setOpenSections] = useState({
    propertyType: true,
    bhk: true,
    price: true,
  });

  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const type = selectedTypes.length === 1 ? selectedTypes[0] : undefined;
      const data = await api.getProperties({
        city: searchQuery.trim() || undefined,
        type,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });

      let filtered = selectedTypes.length > 1
          ? data.filter((p) => selectedTypes.includes(p.type))
          : data;

      if (verifiedOnly) filtered = filtered.filter((p) => p.isVerified);
      if (sortBy === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
      if (sortBy === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

      setProperties(filtered);
    } catch {
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTypes, priceRange, verifiedOnly, sortBy]);

  useEffect(() => { fetchProperties(); }, []);

  const toggleType = (t: PropertyType) =>
      setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const toggleBhk = (b: string) =>
      setSelectedBhk((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const toggleSection = (key: keyof typeof openSections) =>
      setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedBhk([]);
    setPriceRange([5000, 100000]);
    setVerifiedOnly(false);
  };

  const activeFilterCount =
      selectedTypes.length + selectedBhk.length +
      (verifiedOnly ? 1 : 0) +
      (priceRange[0] !== 5000 || priceRange[1] !== 100000 ? 1 : 0);

  const SidebarContent = () => (
      <div className="space-y-0 divide-y divide-border">
        <div className="flex items-center justify-between pb-4">
          <h3 className="font-semibold text-base">Filters</h3>
          {activeFilterCount > 0 && (
              <button onClick={handleClearAll} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <X className="h-3 w-3" /> Reset all
              </button>
          )}
        </div>

        <div className="py-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)}
                      className="border-primary data-[state=checked]:bg-primary" />
            <span className="text-sm font-medium">Verified Properties Only</span>
          </label>
        </div>

        <div className="py-4 space-y-3">
          <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full text-left">
            <span className="text-sm font-semibold">Rent Range</span>
            {openSections.price ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {openSections.price && (
              <div className="space-y-3 pt-1">
                <Slider value={priceRange} onValueChange={setPriceRange} max={100000} min={5000} step={1000} className="w-full" />
                <div className="flex justify-between text-sm font-medium">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
          )}
        </div>

        <div className="py-4 space-y-3">
          <button onClick={() => toggleSection("propertyType")} className="flex items-center justify-between w-full text-left">
            <span className="text-sm font-semibold">Property Type</span>
            {openSections.propertyType ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {openSections.propertyType && (
              <div className="space-y-2.5 pt-1">
                {PROPERTY_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                      <Checkbox id={`type-${value}`} checked={selectedTypes.includes(value)}
                                onCheckedChange={() => toggleType(value)}
                                className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      <span className="text-sm group-hover:text-primary transition-colors">{label}</span>
                    </label>
                ))}
              </div>
          )}
        </div>

        <div className="py-4 space-y-3">
          <button onClick={() => toggleSection("bhk")} className="flex items-center justify-between w-full text-left">
            <span className="text-sm font-semibold">BHK Type</span>
            {openSections.bhk ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {openSections.bhk && (
              <div className="flex flex-wrap gap-2 pt-1">
                {BHK_OPTIONS.map((b) => (
                    <button key={b} onClick={() => toggleBhk(b)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                selectedBhk.includes(b)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}>
                      {b}
                    </button>
                ))}
              </div>
          )}
        </div>

        <div className="pt-4">
          <Button className="w-full bg-primary text-primary-foreground" onClick={fetchProperties} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Apply Filters
          </Button>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-muted/30">
        <Header />

        {/* Top search bar */}
        <div className="bg-white border-b border-border shadow-sm">
          <div className="container py-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search by city, locality or landmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchProperties()}
                    className="pl-10 h-10"
                />
              </div>
              <Button className="h-10 px-6 bg-primary text-primary-foreground shrink-0" onClick={fetchProperties} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
              <Button variant="outline" size="sm" className="md:hidden h-10 relative" onClick={() => setShowMobileFilters(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
                )}
              </Button>
            </div>

            {/* Active chips */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedTypes.map((t) => (
                      <Badge key={t} variant="secondary" className="pl-2.5 pr-1.5 py-1 gap-1 text-xs cursor-pointer" onClick={() => toggleType(t)}>
                        {t} <X className="h-3 w-3" />
                      </Badge>
                  ))}
                  {selectedBhk.map((b) => (
                      <Badge key={b} variant="secondary" className="pl-2.5 pr-1.5 py-1 gap-1 text-xs cursor-pointer" onClick={() => toggleBhk(b)}>
                        {b} <X className="h-3 w-3" />
                      </Badge>
                  ))}
                  {verifiedOnly && (
                      <Badge variant="secondary" className="pl-2.5 pr-1.5 py-1 gap-1 text-xs cursor-pointer" onClick={() => setVerifiedOnly(false)}>
                        Verified only <X className="h-3 w-3" />
                      </Badge>
                  )}
                  {(priceRange[0] !== 5000 || priceRange[1] !== 100000) && (
                      <Badge variant="secondary" className="pl-2.5 pr-1.5 py-1 gap-1 text-xs cursor-pointer" onClick={() => setPriceRange([5000, 100000])}>
                        {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])} <X className="h-3 w-3" />
                      </Badge>
                  )}
                </div>
            )}
          </div>
        </div>

        <div className="container py-6">
          <div className="flex gap-6 items-start">

            {/* Desktop sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0 sticky top-20">
              <div className="bg-white rounded-xl border border-border shadow-soft p-5">
                <SidebarContent />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {/* Results + sort */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">
                  {loading ? "Loading..." : (
                      <>Showing <span className="text-primary font-bold">{properties.length}</span> propert{properties.length === 1 ? "y" : "ies"}
                        {searchQuery && <> in <span className="font-semibold">{searchQuery}</span></>}</>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Sort by:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                          className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loading && (
                  <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Finding properties...</p>
                  </div>
              )}

              {error && !loading && (
                  <div className="text-center py-16 bg-white rounded-xl border border-border">
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button variant="outline" onClick={fetchProperties}>Retry</Button>
                  </div>
              )}

              {!loading && !error && properties.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border border-border">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium mb-1">No properties found</p>
                    <p className="text-muted-foreground text-sm mb-5">Try adjusting your filters or search in a different area.</p>
                    <Button variant="outline" onClick={handleClearAll}>Clear All Filters</Button>
                  </div>
              )}

              {!loading && !error && properties.length > 0 && (
                  <div className="space-y-4">
                    {properties.map((p) => <PropertyCard key={p.id} {...toCardProps(p)} />)}
                  </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile filters drawer */}
        {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-5 shadow-large overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Filters</span>
                  <button onClick={() => setShowMobileFilters(false)}><X className="h-5 w-5" /></button>
                </div>
                <SidebarContent />
              </div>
            </div>
        )}

        <Footer />
      </div>
  );
};

export default Properties;