import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Shield, Home, Key } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-primary-foreground">{user.name[0]}</span>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <Badge variant="secondary" className="mx-auto mt-2">
              {user.role === "owner" ? (
                <><Home className="h-3 w-3 mr-1" /> Property Owner</>
              ) : (
                <><Key className="h-3 w-3 mr-1" /> Tenant / Renter</>
              )}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: user.phone },
              { icon: Calendar, label: "Joined", value: user.joinedDate },
              { icon: Shield, label: "Verification", value: "Verified ✓" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <item.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-4 flex gap-3">
              <Button variant="outline" className="flex-1">Edit Profile</Button>
              <Button variant="outline" className="flex-1">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
