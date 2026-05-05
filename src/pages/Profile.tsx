import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Shield, Home, Key, Camera, Loader2 } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
    const { user, isAuthenticated, updateAvatar } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

    const roleLabel =
        user.role === "OWNER" ? "Property Owner"
            : user.role === "ADMIN" ? "Administrator"
                : "Tenant / Renter";

    const roleIcon =
        user.role === "OWNER" ? <Home className="h-3 w-3 mr-1" />
            : user.role === "ADMIN" ? <Shield className="h-3 w-3 mr-1" />
                : <Key className="h-3 w-3 mr-1" />;

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
        : "—";

    const initial = (user.fullName || user.username || "?")[0].toUpperCase();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Image too large", description: "Please choose an image under 5MB.", variant: "destructive" });
            return;
        }
        setUploading(true);
        try {
            const url = await uploadImageToCloudinary(file);
            updateAvatar(url);
            toast({ title: "Profile photo updated!" });
        } catch (err) {
            toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const details = [
        { icon: User, label: "Username", value: user.username },
        { icon: Mail, label: "Email", value: user.email },
        { icon: Phone, label: "Phone", value: user.phoneNumber || "Not provided" },
        { icon: Calendar, label: "Joined", value: joinedDate },
        { icon: Shield, label: "Account", value: "Verified ✓" },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                <Card>
                    <CardHeader className="text-center pb-2">
                        <div className="relative mx-auto w-24 h-24 mb-4">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.fullName || user.username}
                                     className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
                            ) : (
                                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center border-4 border-primary/20">
                                    <span className="text-3xl font-bold text-primary-foreground">{initial}</span>
                                </div>
                            )}
                            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors border-2 border-background"
                                    title="Change profile photo">
                                {uploading
                                    ? <Loader2 className="h-3.5 w-3.5 text-primary-foreground animate-spin" />
                                    : <Camera className="h-3.5 w-3.5 text-primary-foreground" />}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*"
                                   className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <CardTitle className="text-xl">{user.fullName || user.username}</CardTitle>
                        <Badge variant="secondary" className="mx-auto mt-2 flex items-center w-fit">
                            {roleIcon}{roleLabel}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Click the camera icon to update your profile photo</p>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                        {details.map((item) => (
                            <div key={item.label} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
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