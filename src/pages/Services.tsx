import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  CreditCard, 
  Shield, 
  Home, 
  TrendingUp, 
  FileText, 
  Users,
  Phone,
  Percent,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const Services = () => {
  const mainServices = [
    {
      icon: CreditCard,
      title: "Pay on Credit",
      description: "Pay your rent using Credit Card with zero additional charges and earn rewards",
      features: ["Zero Processing Fee", "Reward Points", "EMI Options", "Instant Processing"],
      badge: "Popular",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Housing Protect",
      description: "Complete protection against cyber frauds and secure property transactions",
      features: ["Fraud Protection", "Secure Payments", "Legal Support", "24/7 Monitoring"],
      badge: "Secure",
      color: "green",
    },
    {
      icon: Home,
      title: "Zero Brokerage",
      description: "Direct access to property owners without any brokerage charges",
      features: ["Direct Contact", "No Hidden Charges", "Verified Owners", "Quick Process"],
      badge: "Free",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "Price Trends",
      description: "Get detailed property rates and price trends analysis for informed decisions",
      features: ["Market Analysis", "Price History", "Future Predictions", "Comparative Data"],
      badge: "Insights",
      color: "purple",
    },
  ];

  const additionalServices = [
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Complete legal documentation and agreement preparation",
    },
    {
      icon: Users,
      title: "Tenant Verification",
      description: "Comprehensive background verification of tenants",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your queries",
    },
    {
      icon: Percent,
      title: "Loan Assistance",
      description: "Home loan assistance with lowest interest rates",
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "Fast property registration and documentation",
    },
    {
      icon: CheckCircle,
      title: "Property Inspection",
      description: "Professional property inspection and quality assurance",
    },
  ];

  const pricing = [
    {
      name: "Basic Plan",
      price: "Free",
      description: "Perfect for individual property seekers",
      features: [
        "Browse unlimited properties",
        "Basic search filters",
        "Contact property owners",
        "Save favorite properties",
      ],
      popular: false,
    },
    {
      name: "Premium Plan",
      price: "₹999/month",
      description: "Advanced features for serious property hunters",
      features: [
        "All Basic Plan features",
        "Advanced search filters",
        "Priority customer support",
        "Property price alerts",
        "Virtual property tours",
      ],
      popular: true,
    },
    {
      name: "Enterprise Plan",
      price: "₹2,999/month",
      description: "Complete solution for property professionals",
      features: [
        "All Premium Plan features",
        "Bulk property management",
        "Custom reporting",
        "Dedicated account manager",
        "API access",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive real estate solutions designed to make your property journey seamless and secure
          </p>
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-medium">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our flagship services that make property rental hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="hover:shadow-medium transition-all group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center group-hover:bg-primary-lighter transition-colors">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{service.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-gradient-primary text-primary-foreground">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Additional <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Extended services to support your complete property needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all group">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-lighter transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Plan</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Flexible pricing options to suit your property needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-medium transition-all ${
                plan.popular ? 'border-primary shadow-medium' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary mt-4">{plan.price}</div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {plan.price === "Free" ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get <span className="text-primary">Started?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who found their perfect rental homes
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-medium">
              Start Your Search
            </Button>
            <Button size="lg" variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;