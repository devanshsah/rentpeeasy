import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Target, 
  Users, 
  Award, 
  Globe, 
  Shield, 
  Zap,
  Heart,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the security of every transaction and verify all listings to ensure safe property dealings.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. We strive to exceed expectations at every step.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We leverage cutting-edge technology to simplify the property rental process and enhance user experience.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "We believe in continuous growth - for our platform, our partners, and our customers' success.",
    },
  ];

  const stats = [
    { icon: Users, value: "1M+", label: "Happy Customers" },
    { icon: Globe, value: "25+", label: "Cities Covered" },
    { icon: Award, value: "50K+", label: "Properties Listed" },
    { icon: CheckCircle, value: "99%", label: "Customer Satisfaction" },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      description: "15+ years experience in real estate and technology",
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
      description: "Expert in scaling technology platforms and user experience",
    },
    {
      name: "Amit Patel",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      description: "Specialist in operations management and customer success",
    },
    {
      name: "Sunita Reddy",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
      description: "Digital marketing expert with focus on customer acquisition",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to simplify property rentals in India",
    },
    {
      year: "2021",
      title: "First 10K Users",
      description: "Reached our first major milestone of 10,000 registered users",
    },
    {
      year: "2022",
      title: "Multi-City Expansion",
      description: "Expanded operations to 10 major cities across India",
    },
    {
      year: "2023",
      title: "1M+ Properties",
      description: "Crossed 1 million property listings on our platform",
    },
    {
      year: "2024",
      title: "Industry Leader",
      description: "Became the leading property rental platform in India",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container text-center">
          <Badge className="mb-6 bg-primary-lightest text-primary border-primary/20">
            About RentEasy
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transforming Property Rentals
            <span className="block text-primary">Across India</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're on a mission to make property rental transparent, secure, and hassle-free for millions of Indians. 
            Join us in revolutionizing the real estate industry.
          </p>
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-medium">
            Our Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize property rentals by providing a transparent, secure, and efficient platform 
                  that connects property owners with tenants across India, eliminating traditional barriers 
                  and creating value for all stakeholders.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become India's most trusted property rental platform, where finding the perfect home 
                  is as simple as a few clicks, and where every transaction is secure, transparent, 
                  and beneficial for all parties involved.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-medium transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-lighter transition-colors">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key milestones that shaped our company and the real estate industry
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{milestone.year}</span>
                    </div>
                  </div>
                  <Card className="flex-1 hover:shadow-medium transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-primary">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate individuals behind RentEasy's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all group">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our <span className="text-primary">Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're looking for a property or want to list yours, we're here to help you succeed
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-medium">
              Start Your Search
            </Button>
            <Button size="lg" variant="outline">
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;