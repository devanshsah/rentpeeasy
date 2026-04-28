import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Shield, Home, Key } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const roleLabel =
      user.role === "OWNER"
          ? "Property Owner"
          : user.role === "ADMIN"
              ? "Administrator"
              : "Tenant / Renter";

  const roleIcon =
      user.role === "OWNER" ? (
          <Home className="h-3 w-3 mr-1" />
      ) : user.role === "ADMIN" ? (
          <Shield className="h-3 w-3 mr-1" />
      ) : (
          <Key className="h-3 w-3 mr-1" />
      );

  const joinedDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
      : "—";

  const details = [
    { icon: User, label: "Username", value: user.username },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phoneNumber || "Not provided" },
    { icon: Calendar, label: "Joined", value: joinedDate },
    { icon: Shield, label: "Verification", value: "Verified ✓" },
  ];

  return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-primary-foreground">
                {(user.fullName || user.username || "?")[0].toUpperCase()}
              </span>
              </div>
              <CardTitle className="text-xl">
                {user.fullName || user.username}
              </CardTitle>
              <Badge variant="secondary" className="mx-auto mt-2 flex items-center w-fit">
                {roleIcon}
                {roleLabel}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3 pt-6">
              {details.map((item) => (
                  <div
                      key={item.label}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
              ))}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
  );
};

export default Profile;