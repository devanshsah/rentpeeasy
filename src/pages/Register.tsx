import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { UserPlus, Home, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("tenant");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = register(name, email, password, phone, role);
    if (result.success) {
      toast({ title: "Account Created!", description: `Welcome to RentEasy as a ${role === "owner" ? "Property Owner" : "Tenant"}.` });
      navigate("/dashboard");
    } else {
      toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
            <span className="text-2xl font-bold text-primary">RentEasy</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-1">Join RentEasy today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign Up</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">I am a</label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="grid grid-cols-2 gap-3">
                  <label
                    htmlFor="role-owner"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      role === "owner" ? "border-primary bg-primary-lightest" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="owner" id="role-owner" className="sr-only" />
                    <Home className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Property Owner</span>
                    <span className="text-xs text-muted-foreground text-center">I want to list properties</span>
                  </label>
                  <label
                    htmlFor="role-tenant"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      role === "tenant" ? "border-primary bg-primary-lightest" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="tenant" id="role-tenant" className="sr-only" />
                    <Key className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Tenant / Renter</span>
                    <span className="text-xs text-muted-foreground text-center">I want to find a property</span>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
