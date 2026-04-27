import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Shield, CreditCard, Home as HomeIcon, TrendingUp, Users, ArrowRight, Star, Loader2 } from "lucide-react";
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

const services = [
  { icon: CreditCard, title: "Pay on Credit", description: "Pay your rent using Credit Card with zero additional charges", badge: "Popular" },
  { icon: Shield, title: "Housing Protect", description: "Protection against cyber frauds and secure transactions", badge: "Secure" },
  { icon: HomeIcon, title: "Zero Brokerage", description: "Instant access to verified properties without brokerage", badge: "Free" },
  { icon: TrendingUp, title: "Price Trends", description: "Get property rates & price trends of top locations", badge: "Insights" },
];

const testimonials = [
  { name: "Priya Sharma", location: "Bangalore", rating: 5, text: "Found my perfect 2BHK apartment within a week. The verification process was smooth and transparent." },
  { name: "Rahul Kumar", location: "Delhi", rating: 5, text: "Excellent service! Zero brokerage and genuine listings. Highly recommended for property seekers." },
  { name: "Anjali Patel", location: "Mumbai", rating: 5, text: "The platform is user-friendly and the support team is very responsive. Great experience overall." },
];

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getFeaturedProperties()
        .then((data) => { if (!cancelled) setFeaturedProperties(data); })
        .catch(() => { if (!cancelled) setError("Could not load featured properties."); })
        .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
      <div className="min-h-screen">
        <Header />
        <Hero />

        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our <span className="text-primary">Services</span></h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Comprehensive real estate solutions designed to make your property journey seamless</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                  <Card key={index} className="text-center hover:shadow-medium transition-all group">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-lighter transition-colors">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">{service.badge}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-primary">Properties</span></h2>
                <p className="text-muted-foreground text-lg">Hand-picked properties that offer the best value</p>
              </div>
              <Link to="/properties">
                <Button variant="outline" className="hidden md:flex">View All Properties <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>

            {loading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {error && !loading && <p className="text-center text-muted-foreground py-8">{error}</p>}
            {!loading && !error && featuredProperties.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No featured properties at the moment. Check back soon!</p>
            )}
            {!loading && featuredProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProperties.map((property) => (
                      <PropertyCard key={property.id} {...toPropertyCardProps(property)} />
                  ))}
                </div>
            )}

            <div className="text-center mt-8 md:hidden">
              <Link to="/properties">
                <Button variant="outline">View All Properties <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-hero">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Trusted by <span className="text-primary">Thousands</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[{ value: "50K+", label: "Properties Listed" }, { value: "25+", label: "Cities Covered" }, { value: "1M+", label: "Happy Customers" }, { value: "99%", label: "Verified Properties" }].map(({ value, label }) => (
                  <div key={label} className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-primary">{value}</div>
                    <div className="text-muted-foreground">{label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-primary">Customers Say</span></h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Real experiences from real customers who found their dream homes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                  <Card key={index} className="hover:shadow-medium transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
  );
};

export default Home;