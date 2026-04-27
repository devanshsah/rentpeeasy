import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppUser } from "@/contexts/AuthContext";
import {
  Building, Eye, MessageSquare, Plus, IndianRupee, Pencil, Trash2,
  TrendingUp, BarChart3, Loader2,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { api, type Property } from "@/lib/api";

// ── types ─────────────────────────────────────────────────────────────────────

type NewPropertyForm = {
  title: string;
  type: string;
  city: string;
  locality: string;
  price: string;
  beds: string;
  baths: string;
  squareFeet: string;
  contactNumber: string;
  description: string;
};

const EMPTY_FORM: NewPropertyForm = {
  title: "",
  type: "APARTMENT",
  city: "",
  locality: "",
  price: "",
  beds: "",
  baths: "",
  squareFeet: "",
  contactNumber: "",
  description: "",
};

const PIE_COLORS = ["hsl(221,83%,53%)", "hsl(142,76%,36%)", "hsl(38,92%,50%)"];

// ── component ─────────────────────────────────────────────────────────────────

const OwnerDashboard = ({ user }: { user: AppUser }) => {
  const { toast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [form, setForm] = useState<NewPropertyForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── fetch owner's properties ───────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api
        .getProperties()
        .then((all) => {
          // Filter to properties owned by the current user if ownerId is present
          const mine = all.filter(
              (p) => !p.ownerId || String(p.ownerId) === String(user.id)
          );
          setProperties(mine);
        })
        .catch(() =>
            toast({ title: "Could not load your properties", variant: "destructive" })
        )
        .finally(() => setLoading(false));
  }, [user.id]);

  // ── derived stats ──────────────────────────────────────────────────────────
  const totalRevenue = properties.reduce((s, p) => s + (p.price ?? 0), 0);

  const stats = [
    { label: "Properties", value: String(properties.length), icon: Building, color: "text-primary" },
    { label: "Total Listings", value: String(properties.length), icon: Eye, color: "text-green-600" },
    { label: "Types Listed", value: String(new Set(properties.map((p) => p.type)).size), icon: BarChart3, color: "text-orange-500" },
    { label: "Total Rent/mo", value: `₹${Math.round(totalRevenue / 1000)}K`, icon: IndianRupee, color: "text-primary" },
  ];

  // Pie data: count by type
  const typeMap = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // ── form helpers ───────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditTarget(p);
    setForm({
      title: p.title,
      type: p.type,
      city: p.city ?? "",
      locality: p.locality ?? "",
      price: String(p.price),
      beds: String(p.beds ?? ""),
      baths: String(p.baths ?? ""),
      squareFeet: String(p.squareFeet ?? ""),
      contactNumber: p.contactNumber ?? "",
      description: p.description ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.city) {
      toast({ title: "Please fill in Title, City, and Price", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        type: form.type,
        city: form.city,
        locality: form.locality,
        price: Number(form.price),
        beds: form.beds ? Number(form.beds) : undefined,
        baths: form.baths ? Number(form.baths) : undefined,
        squareFeet: form.squareFeet ? Number(form.squareFeet) : undefined,
        contactNumber: form.contactNumber || undefined,
        description: form.description || undefined,
      };

      if (editTarget) {
        const updated = await api.updateProperty(editTarget.id, payload);
        setProperties((prev) =>
            prev.map((p) => (p.id === editTarget.id ? updated : p))
        );
        toast({ title: "Property updated!" });
      } else {
        const created = await api.createProperty(payload);
        setProperties((prev) => [created, ...prev]);
        toast({ title: "Property listed!" });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Property deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Manage your properties</p>
          </div>
          <Button
              className="bg-gradient-primary text-primary-foreground"
              onClick={openCreate}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Property
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-primary-lightest rounded-lg">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Charts */}
        {properties.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" /> Rent Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={properties.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                          dataKey="title"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(v) => v.slice(0, 10) + "…"}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => [`₹${v}`, "Rent"]} />
                      <Bar dataKey="price" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4" /> By Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, value }) => `${name} (${value})`}
                          labelLine={false}
                      >
                        {pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
        )}

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    You haven't listed any properties yet.
                  </p>
                  <Button variant="outline" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" /> Add your first property
                  </Button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Property</th>
                      <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 pr-4 font-medium text-muted-foreground">City</th>
                      <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Rent/mo</th>
                      <th className="text-right py-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {properties.map((p) => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{p.title}</td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary">{p.type}</Badge>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">{p.city ?? "—"}</td>
                          <td className="py-3 pr-4 font-semibold text-primary">
                            ₹{p.price.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEdit(p)}
                                  title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" title="Delete">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Property?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove "{p.title}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editTarget ? "Edit Property" : "Add New Property"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input
                    placeholder="e.g. Modern 2BHK Apartment in Koramangala"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Type *</Label>
                  <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["PG", "ROOM", "APARTMENT", "FLAT", "VILLA", "COMMERCIAL"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Price / month (₹) *</Label>
                  <Input
                      type="number"
                      placeholder="25000"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>City *</Label>
                  <Input
                      placeholder="Bangalore"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Locality</Label>
                  <Input
                      placeholder="Koramangala"
                      value={form.locality}
                      onChange={(e) => setForm({ ...form, locality: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Beds</Label>
                  <Input
                      type="number"
                      placeholder="2"
                      value={form.beds}
                      onChange={(e) => setForm({ ...form, beds: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Baths</Label>
                  <Input
                      type="number"
                      placeholder="2"
                      value={form.baths}
                      onChange={(e) => setForm({ ...form, baths: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Sq.ft</Label>
                  <Input
                      type="number"
                      placeholder="1200"
                      value={form.squareFeet}
                      onChange={(e) => setForm({ ...form, squareFeet: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Contact Number</Label>
                <Input
                    placeholder="+91-9876543210"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                    rows={3}
                    placeholder="Describe the property..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                  className="bg-gradient-primary text-primary-foreground"
                  onClick={handleSave}
                  disabled={saving}
              >
                {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {editTarget ? "Save Changes" : "List Property"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default OwnerDashboard;
