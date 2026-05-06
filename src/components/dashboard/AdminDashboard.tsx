import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppUser as DemoUser } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Building, ShieldCheck, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Search, Eye, Ban, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const PLATFORM_STATS = {
  totalUsers: 1248,
  totalOwners: 342,
  totalTenants: 906,
  totalProperties: 867,
  activeListings: 534,
  pendingReviews: 23,
  totalRevenue: "₹12.4L",
  monthlyGrowth: "+18%",
};

const USER_GROWTH = [
  { month: "Sep", owners: 220, tenants: 580 },
  { month: "Oct", owners: 248, tenants: 650 },
  { month: "Nov", owners: 275, tenants: 720 },
  { month: "Dec", owners: 298, tenants: 790 },
  { month: "Jan", owners: 320, tenants: 850 },
  { month: "Feb", owners: 342, tenants: 906 },
];

const LISTING_STATS = [
  { month: "Sep", new: 45, approved: 40, rejected: 5 },
  { month: "Oct", new: 62, approved: 55, rejected: 7 },
  { month: "Nov", new: 78, approved: 70, rejected: 8 },
  { month: "Dec", new: 56, approved: 50, rejected: 6 },
  { month: "Jan", new: 84, approved: 76, rejected: 8 },
  { month: "Feb", new: 91, approved: 82, rejected: 9 },
];

const PROPERTY_TYPES = [
  { name: "1BHK", value: 280, color: "hsl(221, 83%, 53%)" },
  { name: "2BHK", value: 320, color: "hsl(217, 91%, 60%)" },
  { name: "3BHK", value: 180, color: "hsl(142, 76%, 36%)" },
  { name: "Villa", value: 87, color: "hsl(38, 92%, 50%)" },
];

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "tenant";
  status: "active" | "suspended";
  properties?: number;
  joinedDate: string;
}

interface ManagedProperty {
  id: number;
  title: string;
  owner: string;
  status: "Active" | "Pending Review" | "Flagged" | "Rejected";
  rent: string;
  reports: number;
}

const MOCK_USERS: ManagedUser[] = [
  { id: "1", name: "Rajesh Verma", email: "owner@renteasy.com", role: "owner", status: "active", properties: 3, joinedDate: "Jan 2024" },
  { id: "2", name: "Ananya Singh", email: "tenant@renteasy.com", role: "tenant", status: "active", joinedDate: "Mar 2024" },
  { id: "3", name: "Vikram Patel", email: "vikram@email.com", role: "tenant", status: "active", joinedDate: "Apr 2024" },
  { id: "4", name: "Priya Sharma", email: "priya@email.com", role: "owner", status: "suspended", properties: 5, joinedDate: "Feb 2024" },
  { id: "5", name: "Deepa Rao", email: "deepa@email.com", role: "tenant", status: "active", joinedDate: "May 2024" },
  { id: "6", name: "Amit Kumar", email: "amit@email.com", role: "owner", status: "active", properties: 2, joinedDate: "Jun 2024" },
];

const MOCK_PROPERTIES: ManagedProperty[] = [
  { id: 1, title: "Modern 2BHK in Koramangala", owner: "Rajesh Verma", status: "Active", rent: "₹25,000", reports: 0 },
  { id: 2, title: "Luxury 3BHK in MG Road", owner: "Priya Sharma", status: "Flagged", rent: "₹55,000", reports: 3 },
  { id: 3, title: "Studio in Electronic City", owner: "Amit Kumar", status: "Pending Review", rent: "₹12,000", reports: 0 },
  { id: 4, title: "Penthouse in Lavelle Road", owner: "Priya Sharma", status: "Pending Review", rent: "₹1,20,000", reports: 0 },
  { id: 5, title: "1BHK in BTM Layout", owner: "Rajesh Verma", status: "Active", rent: "₹14,000", reports: 1 },
  { id: 6, title: "Duplex in JP Nagar", owner: "Amit Kumar", status: "Rejected", rent: "₹35,000", reports: 5 },
];

const AdminDashboard = ({ user }: { user: DemoUser }) => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [userSearch, setUserSearch] = useState("");
  const [propSearch, setPropSearch] = useState("");
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProperties = properties.filter(
    (p) => p.title.toLowerCase().includes(propSearch.toLowerCase()) || p.owner.toLowerCase().includes(propSearch.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u))
    );
    toast({ title: "User status updated" });
  };

  const updatePropertyStatus = (id: number, status: ManagedProperty["status"]) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast({ title: `Property ${status.toLowerCase()}` });
  };

  const propStatusColor = (s: string) => {
    switch (s) {
      case "Active": return "default";
      case "Pending Review": return "outline";
      case "Flagged": return "destructive";
      case "Rejected": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview & moderation · Welcome, {user.name}</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: PLATFORM_STATS.totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
          { label: "Properties", value: PLATFORM_STATS.totalProperties.toLocaleString(), icon: Building, color: "text-green-600" },
          { label: "Pending Reviews", value: String(PLATFORM_STATS.pendingReviews), icon: AlertTriangle, color: "text-orange-500" },
          { label: "Platform Revenue", value: PLATFORM_STATS.totalRevenue, icon: TrendingUp, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" /> User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={USER_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="owners" stroke="hsl(221, 83%, 53%)" strokeWidth={2} name="Owners" />
                <Line type="monotone" dataKey="tenants" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Tenants" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" /> Listings Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={LISTING_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="approved" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Approved" />
                <Bar dataKey="rejected" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 flex justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PROPERTY_TYPES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {PROPERTY_TYPES.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="properties">Property Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email} · Joined {u.joinedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={u.role === "owner" ? "default" : "secondary"}>{u.role}</Badge>
                      <Badge variant={u.status === "active" ? "outline" : "destructive"}>{u.status}</Badge>
                      {u.properties !== undefined && (
                        <span className="text-xs text-muted-foreground">{u.properties} properties</span>
                      )}
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toggleUserStatus(u.id)}>
                        {u.status === "active" ? <><Ban className="h-3 w-3 mr-1" /> Suspend</> : <><CheckCircle className="h-3 w-3 mr-1" /> Activate</>}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs">
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-9" value={propSearch} onChange={(e) => setPropSearch(e.target.value)} />
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredProperties.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground">By {p.owner} · {p.rent}/month</p>
                      {p.reports > 0 && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {p.reports} report{p.reports > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={propStatusColor(p.status) as any}>{p.status}</Badge>
                      {(p.status === "Pending Review" || p.status === "Flagged") && (
                        <>
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => updatePropertyStatus(p.id, "Active")}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:text-destructive" onClick={() => updatePropertyStatus(p.id, "Rejected")}>
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 text-xs">
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
