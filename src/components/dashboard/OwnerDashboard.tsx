import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoUser } from "@/contexts/AuthContext";
import { Building, Eye, MessageSquare, Plus, IndianRupee, Pencil, Trash2, CheckCircle, XCircle, TrendingUp, Users, BarChart3, Calendar } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface Property {
  id: number;
  title: string;
  status: "Active" | "Rented" | "Under Review" | "Inactive";
  views: number;
  inquiries: number;
  rent: string;
  tenant?: string;
}

const INITIAL_PROPERTIES: Property[] = [
  { id: 1, title: "Modern 2BHK in Koramangala", status: "Active", views: 234, inquiries: 12, rent: "₹25,000" },
  { id: 2, title: "Studio Apartment in HSR", status: "Rented", views: 156, inquiries: 8, rent: "₹15,000", tenant: "Ananya Singh" },
  { id: 3, title: "3BHK Villa in Whitefield", status: "Under Review", views: 0, inquiries: 0, rent: "₹45,000" },
  { id: 4, title: "1BHK Flat in Indiranagar", status: "Active", views: 89, inquiries: 5, rent: "₹18,000" },
];

const MONTHLY_VIEWS = [
  { month: "Sep", views: 120, inquiries: 8 },
  { month: "Oct", views: 200, inquiries: 14 },
  { month: "Nov", views: 310, inquiries: 18 },
  { month: "Dec", views: 280, inquiries: 22 },
  { month: "Jan", views: 390, inquiries: 25 },
  { month: "Feb", views: 450, inquiries: 30 },
];

const REVENUE_DATA = [
  { month: "Sep", revenue: 15000 },
  { month: "Oct", revenue: 25000 },
  { month: "Nov", revenue: 40000 },
  { month: "Dec", revenue: 55000 },
  { month: "Jan", revenue: 70000 },
  { month: "Feb", revenue: 85000 },
];

const OCCUPANCY_DATA = [
  { name: "Rented", value: 1, color: "hsl(142, 76%, 36%)" },
  { name: "Active", value: 2, color: "hsl(221, 83%, 53%)" },
  { name: "Under Review", value: 1, color: "hsl(38, 92%, 50%)" },
];

const OwnerDashboard = ({ user }: { user: DemoUser }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const totalViews = properties.reduce((s, p) => s + p.views, 0);
  const totalInquiries = properties.reduce((s, p) => s + p.inquiries, 0);
  const rentedRevenue = properties.filter(p => p.status === "Rented").reduce((s, p) => s + parseInt(p.rent.replace(/[₹,]/g, "")), 0);

  const stats = [
    { label: "Properties", value: String(properties.length), icon: Building, color: "text-primary" },
    { label: "Total Views", value: String(totalViews), icon: Eye, color: "text-green-600" },
    { label: "Inquiries", value: String(totalInquiries), icon: MessageSquare, color: "text-orange-500" },
    { label: "Monthly Revenue", value: `₹${Math.round(rentedRevenue / 1000)}K`, icon: IndianRupee, color: "text-primary" },
  ];

  const handleDelete = () => {
    if (deleteId === null) return;
    setProperties((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Property deleted", description: "The property has been removed." });
  };

  const handleToggleRented = (id: number) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Rented" ? "Active" : "Rented", tenant: p.status === "Rented" ? undefined : "New Tenant" }
          : p
      )
    );
    toast({ title: "Status updated" });
  };

  const handleEditSave = () => {
    if (!editProperty) return;
    setProperties((prev) => prev.map((p) => (p.id === editProperty.id ? editProperty : p)));
    setEditOpen(false);
    setEditProperty(null);
    toast({ title: "Property updated", description: "Changes saved successfully." });
  };

  const handleAddProperty = () => {
    const newProp: Property = {
      id: Date.now(),
      title: "New Property",
      status: "Under Review",
      views: 0,
      inquiries: 0,
      rent: "₹10,000",
    };
    setProperties((prev) => [...prev, newProp]);
    setEditProperty(newProp);
    setEditOpen(true);
  };

  const statusColor = (s: Property["status"]) => {
    switch (s) {
      case "Active": return "default";
      case "Rented": return "secondary";
      case "Under Review": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Property Owner Dashboard</p>
        </div>
        <Button onClick={handleAddProperty} className="bg-gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
              <BarChart3 className="h-5 w-5 text-primary" /> Views & Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_VIEWS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="views" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="inquiries" fill="hsl(217, 91%, 75%)" radius={[4, 4, 0, 0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ fill: "hsl(142, 76%, 36%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-primary" /> Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={OCCUPANCY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {OCCUPANCY_DATA.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" /> Top Performing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...properties].sort((a, b) => b.views - a.views).slice(0, 3).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary w-6">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.rent}/month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{p.views} views</p>
                    <p className="text-xs text-muted-foreground">{p.inquiries} inquiries</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" /> My Properties ({properties.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No properties yet. Click "Add Property" to get started.</p>
          ) : (
            <div className="space-y-3">
              {properties.map((prop) => (
                <div key={prop.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-3 hover:bg-muted/80 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-foreground">{prop.title}</h4>
                    <p className="text-sm text-muted-foreground">{prop.rent}/month</p>
                    {prop.tenant && <p className="text-xs text-primary mt-1">Tenant: {prop.tenant}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm text-muted-foreground hidden md:flex gap-3 mr-2">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {prop.views}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {prop.inquiries}</span>
                    </div>
                    <Badge variant={statusColor(prop.status)}>{prop.status}</Badge>

                    <Button size="sm" variant="outline" onClick={() => handleToggleRented(prop.id)} className="h-8 text-xs">
                      {prop.status === "Rented" ? <><XCircle className="h-3 w-3 mr-1" /> Unrent</> : <><CheckCircle className="h-3 w-3 mr-1" /> Mark Rented</>}
                    </Button>

                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setEditProperty({ ...prop }); setEditOpen(true); }}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>

                    <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteId(prop.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditProperty(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {editProperty && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={editProperty.title} onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })} />
              </div>
              <div>
                <Label>Rent (per month)</Label>
                <Input value={editProperty.rent} onChange={(e) => setEditProperty({ ...editProperty, rent: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editProperty.status} onValueChange={(v) => setEditProperty({ ...editProperty, status: v as Property["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editProperty.status === "Rented" && (
                <div>
                  <Label>Tenant Name</Label>
                  <Input value={editProperty.tenant || ""} onChange={(e) => setEditProperty({ ...editProperty, tenant: e.target.value })} />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              { name: "Rahul Mehta", property: "1BHK Flat in Indiranagar", time: "2 days ago" },
            ].map((inq, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {inq.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{inq.name}</p>
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
