import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Truck, BadgePercent } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

type Tab = "buy" | "rent" | "commercial";

const CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Gurgaon",
  "Noida",
  "Ahmedabad",
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState<Tab>("rent");
  const [city, setCity] = useState("Bangalore");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    const q = [city, query].filter(Boolean).join(" ");
    if (q) params.set("q", q);
    if (activeTab === "commercial") params.set("type", "COMMERCIAL");
    navigate(`/properties?${params.toString()}`);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "buy", label: "Buy" },
    { id: "rent", label: "Rent" },
    { id: "commercial", label: "Commercial" },
  ];

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-lightest via-background to-background">
      {/* Subtle background image */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight drop-shadow-sm">
            World's Largest{" "}
            <span className="text-primary">NoBrokerage</span> Property Site
          </h1>

          {/* Promo strip */}
          <div className="inline-flex items-center gap-4 bg-primary-lightest/80 backdrop-blur px-5 py-2.5 rounded-lg text-sm text-foreground/80">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" /> Packers And Movers
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4 text-primary" /> Lowest Prices
            </span>
          </div>

          {/* Search Card */}
          <div className="bg-card rounded-2xl shadow-large border max-w-3xl mx-auto overflow-hidden">
            {/* Tabs */}
            <div className="flex justify-center border-b">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative px-8 py-4 text-base font-semibold transition-colors ${
                    activeTab === t.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t" />
                  )}
                </button>
              ))}
            </div>

            {/* Search Row */}
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="md:w-44 border-b md:border-b-0 md:border-r border-border">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-14 border-0 rounded-none focus:ring-0 text-base font-medium px-4">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Search upto 3 localities or landmarks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-14 border-0 rounded-none focus-visible:ring-0 text-base px-4"
              />

              <Button
                onClick={handleSearch}
                className="h-14 px-8 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center pt-4">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Happy Tenants</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">99%</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
