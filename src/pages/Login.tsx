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
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);

    if (result.success) {
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: result.error ?? "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
              <span className="text-2xl font-bold text-primary">RentPeRazi</span>
            </Link>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Login</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                      type="text"
                      placeholder="your_username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                      autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                      ) : (
                          <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-primary text-primary-foreground"
                    disabled={loading}
                >
                  {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                      <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
                to="/register"
                className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Login;