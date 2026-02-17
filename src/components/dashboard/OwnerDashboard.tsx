import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoUser } from "@/contexts/AuthContext";
import { Building, Eye, MessageSquare, TrendingUp, Plus, IndianRupee } from "lucide-react";

const OwnerDashboard = ({ user }: { user: DemoUser }) => {
  const myProperties = [
    { id: 1, title: "Modern 2BHK in Koramangala", status: "Active", views: 234, inquiries: 12, rent: "₹25,000" },
    { id: 2, title: "Studio Apartment in HSR", status: "Active", views: 156, inquiries: 8, rent: "₹15,000" },
    { id: 3, title: "3BHK Villa in Whitefield", status: "Under Review", views: 0, inquiries: 0, rent: "₹45,000" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Property Owner Dashboard</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Properties", value: "3", icon: Building, color: "text-primary" },
          { label: "Total Views", value: "390", icon: Eye, color: "text-green-600" },
          { label: "Inquiries", value: "20", icon: MessageSquare, color: "text-orange-500" },
          { label: "Revenue", value: "₹85K", icon: IndianRupee, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary-lightest rounded-lg">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" /> My Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myProperties.map((prop) => (
              <div key={prop.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{prop.title}</h4>
                  <p className="text-sm text-muted-foreground">{prop.rent}/month</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground hidden md:flex gap-4">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {prop.views}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {prop.inquiries}</span>
                  </div>
                  <Badge variant={prop.status === "Active" ? "default" : "secondary"}>{prop.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Recent Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Ananya Singh", property: "Modern 2BHK in Koramangala", time: "2 hours ago" },
              { name: "Vikram Patel", property: "Studio Apartment in HSR", time: "5 hours ago" },
              { name: "Deepa Rao", property: "Modern 2BHK in Koramangala", time: "1 day ago" },
            ].map((inq, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-lighter rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {inq.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{inq.name}</p>
                    <p className="text-xs text-muted-foreground">{inq.property}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{inq.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
