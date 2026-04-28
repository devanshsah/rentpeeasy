import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (username.length < 3) {
      toast({ title: "Username must be at least 3 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    const result = await register(username.trim(), email.trim(), password, fullName.trim());
    setLoading(false);

    if (result.success) {
      toast({
        title: "Account Created!",
        description: "Welcome to RentPeRazi!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Registration Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
              <span className="text-2xl font-bold text-primary">RentPeRazi</span>
            </Link>
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-1">Join RentPeRazi today</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sign Up</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Username <span className="text-destructive">*</span>
                  </label>
                  <Input
                      type="text"
                      placeholder="choose_a_username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                      autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    3–50 characters, letters and numbers only
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <Input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <Input
                      type="password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                  />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-primary text-primary-foreground"
                    disabled={loading}
                >
                  {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
                to="/login"
                className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Register;