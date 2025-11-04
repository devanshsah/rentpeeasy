import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Building, Briefcase, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const [searchCity, setSearchCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");

  const handleSearch = () => {
    console.log({ searchCity, propertyType, budgetRange });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Find Your Perfect 
              <span className="block text-primary">Rental Home</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover PGs, Rooms, Flats & Commercial Spaces across India with zero brokerage
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-card/95 backdrop-blur rounded-2xl p-6 shadow-large border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City, Locality, Landmark
                </label>
                <Input
                  placeholder="Search for locality, landmark, project"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="border-border focus:ring-primary">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pg">PG / Hostel</SelectItem>
                    <SelectItem value="room">Single Room</SelectItem>
                    <SelectItem value="flat">Flat / Apartment</SelectItem>
                    <SelectItem value="commercial">Commercial Space</SelectItem>
                    <SelectItem value="villa">Villa / House</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget Range
                </label>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger className="border-border focus:ring-primary">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10k">₹0 - ₹10,000</SelectItem>
                    <SelectItem value="10k-20k">₹10,000 - ₹20,000</SelectItem>
                    <SelectItem value="20k-30k">₹20,000 - ₹30,000</SelectItem>
                    <SelectItem value="30k-50k">₹30,000 - ₹50,000</SelectItem>
                    <SelectItem value="50k+">₹50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large transition-all text-black"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Happy Tenants</div>
            </div>
            <div className="space-y-2">
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