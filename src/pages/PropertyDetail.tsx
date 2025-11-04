import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  CheckCircle2,
  Star,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  ArrowLeft,
  Home,
  Zap,
  Shield,
  Wifi,
  Fan,
  Lightbulb,
  Sofa,
} from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock property data
  const property = {
    id: id,
    title: "4 BHK Independent House for Rent",
    location: "Mansarovar Sector 6, Mansarovar, Jaipur",
    price: "₹26,000",
    type: "Semi Furnished",
    area: 1000,
    beds: 4,
    baths: 2,
    balconies: 1,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    verified: true,
    zeroBrokerage: true,
    overview: {
      security: "₹26,000",
      brokerage: "No Charge",
      maintenance: "₹7,500",
      builtUpArea: "1000 sq.ft",
      furnishing: "Semi Furnished",
      bathrooms: 2,
      balcony: 1,
      availableFrom: "Available now",
      leaseType: "Bachelor",
      ageOfProperty: "0 year",
      parking: "No Parking",
      facing: "North-East",
      gasPipeline: "No",
      gatedCommunity: "No",
      priceNegotiable: "No",
    },
    description:
      "This is a modern and stylish home available for affordable rent in Jaipur. It is a 4 BHK Independent House situated at Mansarovar. Designed to meet your lifestyle needs, the Independent House provides a range of modern amenities for the comfort of the residents. It is semi furnished.",
    furnishings: [
      { icon: Fan, name: "Fan", count: 2 },
      { icon: Lightbulb, name: "Light", count: 1 },
      { icon: Sofa, name: "Wardrobe", count: 1 },
      { icon: Bed, name: "Bed", count: 1 },
    ],
    amenities: ["Regular Water Supply", "Power Backup", "Security", "Parking"],
    rating: 4.7,
    reviews: [
      {
        name: "Sachin",
        text: "Good things here - Spacious place with good connectivity of food and grocery stores. 24x7 water supply.",
        rating: 5,
      },
      {
        name: "Jayant Bh",
        text: "Could be crowded at peak hours due to a girls college nearby. It is also crowded in the evening.",
        rating: 4,
      },
    ],
    neighbourhood: {
      description:
        "Located in Jaipur, Rajasthan, India, the Mansarovar colony was named after a lake in the region. Until 2010, it was the largest colony in Asia. On June 3, 2015, Jaipur Metro began serving the area.",
      connectivity: 4.7,
      neighbourhood: 4.8,
      safety: 4.6,
      livability: 4.7,
      goodThings: ["Nearby metro station", "Green environment"],
      improvements: ["Traffic congestion", "Pollution", "Lack of schools nearby"],
    },
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary">
            Properties
          </Link>
          <span>/</span>
          <span className="text-foreground">Property Details</span>
        </div>
      </div>

      <div className="container pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild>
              <Link to="/properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Link>
            </Button>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
              {property.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${property.title} ${idx + 2}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{property.title}</h1>
                    {property.verified && (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        VERIFIED
                      </Badge>
                    )}
                    {property.zeroBrokerage && (
                      <Badge variant="secondary">Zero Brokerage</Badge>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: Aug 12, 2025
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {property.price}
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <span>{property.area} sq.ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span>{property.balconies} Balcony</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(property.overview).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About this property</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </CardContent>
            </Card>

            {/* Furnishings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Furnishings</h2>
                <div className="flex flex-wrap gap-4">
                  {property.furnishings.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>
                        {item.count} {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Neighbourhood */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Explore Neighbourhood - Mansarovar
                </h2>
                <p className="text-muted-foreground mb-6">
                  {property.neighbourhood.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {property.neighbourhood.connectivity}
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Connectivity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {property.neighbourhood.neighbourhood}
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Neighbourhood</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {property.neighbourhood.safety}
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Safety</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {property.neighbourhood.livability}
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Livability</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">Good things here</h3>
                    <ul className="space-y-2">
                      {property.neighbourhood.goodThings.map((thing, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{thing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-orange-600">
                      Things that need improvement
                    </h3>
                    <ul className="space-y-2">
                      {property.neighbourhood.improvements.map((thing, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{thing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Resident Reviews</h2>
                <div className="space-y-4">
                  {property.reviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-semibold">{review.name}</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-96 space-y-6">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Contact Owner</h3>
                <Button className="w-full bg-gradient-primary text-primary-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Owner
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Separator />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
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
