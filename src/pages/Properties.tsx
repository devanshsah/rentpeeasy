import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Search, Filter, MapPin, SlidersHorizontal } from "lucide-react";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "all");
  const [priceRange, setPriceRange] = useState([5000, 100000]);
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      id: "1",
      title: "Modern 2BHK Apartment in Koramangala",
      location: "Koramangala, Bangalore",
      price: "₹25,000/month",
      type: "Apartment",
      beds: 2,
      baths: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      verified: true,
      featured: true,
    },
    {
      id: "2",
      title: "Luxury PG for Working Professionals",
      location: "HSR Layout, Bangalore",
      price: "₹12,000/month",
      type: "PG",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      verified: true,
    },
    {
      id: "3",
      title: "Spacious 3BHK Villa with Garden",
      location: "Whitefield, Bangalore",
      price: "₹45,000/month",
      type: "Villa",
      beds: 3,
      baths: 3,
      area: 2500,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
      verified: true,
      featured: true,
    },
    {
      id: "4",
      title: "Furnished 1BHK Near Metro Station",
      location: "Indiranagar, Bangalore",
      price: "₹18,000/month",
      type: "Apartment",
      beds: 1,
      baths: 1,
      area: 600,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      verified: true,
    },
    {
      id: "5",
      title: "Commercial Office Space",
      location: "Electronic City, Bangalore",
      price: "₹35,000/month",
      type: "Commercial",
      area: 1500,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      verified: true,
    },
    {
      id: "6",
      title: "Shared Room in Premium PG",
      location: "BTM Layout, Bangalore",
      price: "₹8,000/month",
      type: "PG",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      verified: true,
    },
  ];

  const amenities = [
    "Parking", "Security", "Gym", "Swimming Pool", 
    "Power Backup", "Lift", "Internet", "Laundry"
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = propertyType === "all" || 
        p.type.toLowerCase() === propertyType.toLowerCase();
      const priceNum = parseInt(p.price.replace(/[^0-9]/g, ""));
      const matchesPrice = priceNum >= priceRange[0] && priceNum <= priceRange[1];
      return matchesQuery && matchesType && matchesPrice;
    });
  }, [searchQuery, propertyType, priceRange, properties]);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Search Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your <span className="text-primary">Perfect Property</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {filteredProperties.length} properties found
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-2xl p-6 shadow-large">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by city, locality, or landmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pg">PG / Hostel</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:w-auto"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button className="bg-gradient-primary text-primary-foreground shadow-soft">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium">Price Range</h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={5000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Property Types */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium">Property Type</h4>
                {["PG", "Apartment", "Villa", "Commercial"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} />
                    <label
                      htmlFor={type}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="font-medium">Amenities</h4>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox id={amenity} />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* Properties Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Properties</h2>
                <Badge variant="secondary">{filteredProperties.length} found</Badge>
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setPropertyType("all"); setPriceRange([5000, 100000]); }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;