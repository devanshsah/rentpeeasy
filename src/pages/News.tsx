import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, Clock, ArrowRight, Search, TrendingUp, Eye, MessageCircle } from "lucide-react";

const News = () => {
  const featuredArticle = {
    id: "1",
    title: "Delhi-Jaipur Super Expressway: A Game Changer for Real Estate",
    excerpt: "The new expressway will significantly impact property prices and development across 400+ villages in Haryana and Rajasthan.",
    author: "Harini Balasubramanian",
    date: "July 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    category: "Infrastructure",
    views: "2.5K",
    comments: 24,
  };

  const articles = [
    {
      id: "2",
      title: "Joon Realty Launches Rs 450-Cr Luxury Development in Jaipur",
      excerpt: "Pre-bookings for the premium project are slated to begin in July 2025, promising modern amenities and strategic location.",
      author: "Dhwani Meharchandani",
      date: "June 2024",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      category: "Development",
      views: "1.8K",
      comments: 15,
    },
    {
      id: "3",
      title: "Nagpur, Jaipur, Lucknow Among Top Emerging Cities in India",
      excerpt: "Latest report highlights expressways as major growth catalysts, with Mumbai-Nagpur Expressway leading development.",
      author: "Harini Balasubramanian",
      date: "January 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400",
      category: "Market Analysis",
      views: "3.2K",
      comments: 32,
    },
    {
      id: "4",
      title: "Property Investment Trends: What to Expect in 2024",
      excerpt: "Comprehensive analysis of investment patterns and emerging opportunities in the Indian real estate market.",
      author: "Rajesh Kumar",
      date: "March 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      category: "Investment",
      views: "4.1K",
      comments: 28,
    },
    {
      id: "5",
      title: "Tech-Enabled Property Management: The Future is Here",
      excerpt: "How technology is revolutionizing property management and rental experiences across major Indian cities.",
      author: "Priya Sharma",
      date: "April 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400",
      category: "Technology",
      views: "2.9K",
      comments: 19,
    },
    {
      id: "6",
      title: "Affordable Housing Schemes: Government Initiatives Update",
      excerpt: "Latest updates on government housing schemes and their impact on affordable housing across India.",
      author: "Amit Patel",
      date: "May 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400",
      category: "Policy",
      views: "2.1K",
      comments: 12,
    },
  ];

  const categories = ["All", "Infrastructure", "Development", "Market Analysis", "Investment", "Technology", "Policy"];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Estate <span className="text-primary">News & Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay updated with the latest trends, developments, and insights in the Indian real estate market
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-background/95 backdrop-blur"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                  category === "All" ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured Article</h2>
            </div>
            
            <Card className="overflow-hidden hover:shadow-large transition-all group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {featuredArticle.category}
                  </Badge>
                </div>
                
                <CardContent className="p-8 flex flex-col justify-center">
                  <CardTitle className="text-2xl lg:text-3xl mb-4 line-clamp-2">
                    {featuredArticle.title}
                  </CardTitle>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredArticle.readTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredArticle.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {featuredArticle.comments}
                      </div>
                    </div>
                    <Button className="bg-gradient-primary text-primary-foreground shadow-soft">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <Button variant="outline">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-medium transition-all group">
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground border">
                    {article.category}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {article.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-hero border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated with <span className="text-primary">Market Insights</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Get the latest real estate news, market trends, and investment insights delivered directly to your inbox
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  className="flex-1 bg-background/95 backdrop-blur" 
                />
                <Button className="bg-gradient-primary text-primary-foreground shadow-soft">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                No spam, only valuable insights. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;