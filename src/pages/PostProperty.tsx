import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home as HomeIcon,
  MapPin,
  Building2,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
  Video as VideoIcon,
  ShieldCheck,
  Star,
  TrendingUp,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import {
  api,
  uploadMediaToCloudinary,
  type PropertyType,
} from "@/lib/api";

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { key: "property", label: "Property Details", icon: HomeIcon },
  { key: "locality", label: "Locality Details", icon: MapPin },
  { key: "rental", label: "Rental Details", icon: Building2 },
  { key: "amenities", label: "Amenities", icon: Sparkles },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "schedule", label: "Schedule", icon: Calendar },
] as const;

const PROPERTY_TYPES: PropertyType[] = ["PG", "ROOM", "APARTMENT", "FLAT", "VILLA", "COMMERCIAL"];

const BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
const PROPERTY_AGE = ["< 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const FACING = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const FURNISHING = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
const PARKING = ["None", "Bike", "Car", "Both"];
const MAINTENANCE = ["Maintenance Included", "Maintenance Extra"];
const SHOWING_BY = ["Owner", "Tenant", "Caretaker", "Agent"];
const PROPERTY_CONDITION = ["Newly Renovated", "Well Maintained", "Needs Renovation"];
const WATER_SUPPLY = ["Corporation", "Borewell", "Both"];

const AMENITIES = [
  "Lift", "Internet Services", "Air Conditioner", "Club House", "Intercom",
  "Swimming Pool", "Children Play Area", "Fire Safety", "Servant Room",
  "Shopping Center", "Gas Pipeline", "Park", "Rain Water Harvesting",
  "Sewage Treatment Plant", "House Keeping", "Power Backup", "Visitor Parking",
];

// ── Page ──────────────────────────────────────────────────────────────────────
const PostProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [stepIdx, setStepIdx] = useState(0);

  // Property
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT");
  const [bhk, setBhk] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [facing, setFacing] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState("");

  // Locality
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");

  // Rental
  const [availableFor, setAvailableFor] = useState<"rent" | "lease">("rent");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [maintenance, setMaintenance] = useState("Maintenance Included");
  const [availableFrom, setAvailableFrom] = useState("");
  const [preferredTenants, setPreferredTenants] = useState<string[]>([]);
  const [furnishing, setFurnishing] = useState("");
  const [parking, setParking] = useState("");
  const [description, setDescription] = useState("");

  // Amenities step
  const [bathrooms, setBathrooms] = useState(1);
  const [balcony, setBalcony] = useState(0);
  const [waterSupply, setWaterSupply] = useState("");
  const [petAllowed, setPetAllowed] = useState<"Yes" | "No" | "">("");
  const [gym, setGym] = useState<"Yes" | "No" | "">("");
  const [nonVeg, setNonVeg] = useState<"Yes" | "No" | "">("");
  const [gatedSecurity, setGatedSecurity] = useState<"Yes" | "No" | "">("");
  const [showBy, setShowBy] = useState("");
  const [propertyCondition, setPropertyCondition] = useState("");
  const [secondaryNumber, setSecondaryNumber] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Gallery
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Schedule
  const [contactNumber, setContactNumber] = useState(user?.phoneNumber ?? "");
  const [saving, setSaving] = useState(false);

  const progress = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  const togglePreferred = (v: string) =>
    setPreferredTenants((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: `${file.name} too large`,
            description: isVideo ? "Videos must be under 50MB." : "Images must be under 5MB.",
            variant: "destructive",
          });
          continue;
        }
        const url = await uploadMediaToCloudinary(file);
        if (isVideo) setVideos((p) => [...p, url]);
        else setImages((p) => [...p, url]);
      }
      toast({ title: "Upload complete" });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const validateStep = (idx: number): boolean => {
    switch (STEPS[idx].key) {
      case "property":
        if (!title.trim() || !bhk || !builtUpArea) {
          toast({ title: "Please fill Title, BHK and Built-up Area", variant: "destructive" });
          return false;
        }
        return true;
      case "locality":
        if (!city.trim() || !locality.trim()) {
          toast({ title: "Please enter City and Locality", variant: "destructive" });
          return false;
        }
        return true;
      case "rental":
        if (!price || Number(price) <= 0) {
          toast({ title: "Please enter a valid rent", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!validateStep(stepIdx)) return;
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
  };

  const goBack = () => {
    if (stepIdx === 0) navigate(-1);
    else setStepIdx(stepIdx - 1);
  };

  const handleSubmit = async () => {
    // run all validations one more time
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        setStepIdx(i);
        return;
      }
    }
    setSaving(true);
    try {
      const bedsFromBhk = bhk ? parseInt(bhk) : undefined;
      const property = await api.createProperty({
        title: title.trim(),
        type: propertyType,
        city: city.trim(),
        locality: [locality.trim(), landmark.trim()].filter(Boolean).join(", "),
        price: Number(price),
        beds: Number.isFinite(bedsFromBhk) ? bedsFromBhk : undefined,
        baths: bathrooms || undefined,
        squareFeet: builtUpArea ? Number(builtUpArea) : undefined,
        contactNumber: contactNumber.trim() || undefined,
        description: description.trim() || undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        images: [...images, ...videos],
      });
      toast({ title: "Property Listed!", description: "Your property is now live." });
      navigate(`/property/${property.id}`);
    } catch (err) {
      toast({
        title: "Failed to post property",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const currentKey = STEPS[stepIdx].key;

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Login required</h1>
          <p className="text-muted-foreground mb-6">Please log in as an Owner to post a property.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />

      {/* Top progress bar */}
      <div className="border-b bg-background">
        <div className="container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">₹</div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold truncate">Post Your Property</h1>
              <p className="text-xs text-muted-foreground">Free listing • Verified leads</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-primary">{progress}% Done</span>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6">
          {/* Sidebar steps */}
          <aside className="lg:sticky lg:top-24 self-start bg-background border rounded-xl p-2 shadow-sm">
            <ul className="space-y-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i === stepIdx;
                const done = i < stepIdx;
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => setStepIdx(i)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                        active
                          ? "bg-primary/10 text-primary border-l-4 border-primary font-semibold"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : done
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main content */}
          <section className="bg-background border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-6">{STEPS[stepIdx].label}</h2>

            {/* PROPERTY DETAILS */}
            {currentKey === "property" && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <Label>Property Title *</Label>
                  <Input
                    placeholder="e.g. Modern 2BHK in Sector 81"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Apartment Type *</Label>
                  <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>BHK Type *</Label>
                    <Select value={bhk} onValueChange={setBhk}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {BHK_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Floor</Label>
                    <Input type="number" placeholder="Select" value={floor} onChange={(e) => setFloor(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Total Floors</Label>
                    <Input type="number" placeholder="Select" value={totalFloor} onChange={(e) => setTotalFloor(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Property Age</Label>
                    <Select value={propertyAge} onValueChange={setPropertyAge}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {PROPERTY_AGE.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Facing</Label>
                    <Select value={facing} onValueChange={setFacing}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {FACING.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Built Up Area * (Sq.ft)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1200"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* LOCALITY */}
            {currentKey === "locality" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>City *</Label>
                    <Input placeholder="e.g. Noida" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Locality *</Label>
                    <Input placeholder="e.g. Sector 81" value={locality} onChange={(e) => setLocality(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Landmark / Street</Label>
                  <Input
                    placeholder="e.g. Near Metro Pillar 87"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
                <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                  Mark Locality on Map (coming soon)
                </div>
              </div>
            )}

            {/* RENTAL */}
            {currentKey === "rental" && (
              <div className="space-y-5">
                <div>
                  <Label className="block mb-2">Property available for</Label>
                  <div className="flex gap-6">
                    {(["rent", "lease"] as const).map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="availableFor"
                          checked={availableFor === opt}
                          onChange={() => setAvailableFor(opt)}
                          className="accent-primary"
                        />
                        <span className="capitalize text-sm">Only {opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Expected Rent *</Label>
                    <Input type="number" placeholder="₹ 21000" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Expected Deposit</Label>
                    <Input type="number" placeholder="₹ 30000" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={negotiable} onCheckedChange={(v) => setNegotiable(!!v)} />
                  <span className="text-sm">Rent Negotiable</span>
                </label>

                <div className="space-y-1">
                  <Label>Monthly Maintenance</Label>
                  <Select value={maintenance} onValueChange={setMaintenance}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MAINTENANCE.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Available From</Label>
                  <Input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
                </div>

                <div>
                  <Label className="block mb-2">Preferred Tenants</Label>
                  <div className="flex flex-wrap gap-4">
                    {["Anyone", "Family", "Bachelor Female", "Bachelor Male", "Company"].map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox
                          checked={preferredTenants.includes(t)}
                          onCheckedChange={() => togglePreferred(t)}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Furnishing</Label>
                    <Select value={furnishing} onValueChange={setFurnishing}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {FURNISHING.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Parking</Label>
                    <Select value={parking} onValueChange={setParking}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {PARKING.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    placeholder="Write a few lines about your property..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* AMENITIES */}
            {currentKey === "amenities" && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Provide additional details about your property to get maximum visibility.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Bathroom(s) *</Label>
                    <Counter value={bathrooms} onChange={setBathrooms} min={1} />
                  </div>
                  <div className="space-y-1">
                    <Label>Balcony</Label>
                    <Counter value={balcony} onChange={setBalcony} min={0} />
                  </div>
                  <div className="space-y-1">
                    <Label>Water Supply</Label>
                    <Select value={waterSupply} onValueChange={setWaterSupply}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {WATER_SUPPLY.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <YesNo label="Pet Allowed *" value={petAllowed} onChange={setPetAllowed} />
                  <YesNo label="Gym *" value={gym} onChange={setGym} />
                  <YesNo label="Non-Veg Allowed *" value={nonVeg} onChange={setNonVeg} />
                  <YesNo label="Gated Security *" value={gatedSecurity} onChange={setGatedSecurity} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Who will show the property? *</Label>
                    <Select value={showBy} onValueChange={setShowBy}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {SHOWING_BY.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Current Property Condition</Label>
                    <Select value={propertyCondition} onValueChange={setPropertyCondition}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {PROPERTY_CONDITION.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Secondary Number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 Secondary Number"
                    value={secondaryNumber}
                    onChange={(e) => setSecondaryNumber(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t">
                  <Label className="block mb-3">Select the available amenities</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AMENITIES.map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={selectedAmenities.includes(a)}
                          onCheckedChange={() => toggleAmenity(a)}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GALLERY */}
            {currentKey === "gallery" && (
              <div className="space-y-4">
                <Label>Property Photos & Videos</Label>
                <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-primary/40 rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  {uploading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 text-primary" />
                      <span className="text-sm font-medium">Click to upload images or videos</span>
                      <span className="text-xs text-muted-foreground">Images up to 5MB, Videos up to 50MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaUpload}
                    disabled={uploading}
                  />
                </label>

                {(images.length > 0 || videos.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((url, idx) => (
                      <div key={`img-${idx}`} className="relative group aspect-square rounded-md overflow-hidden border">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {videos.map((url, idx) => (
                      <div key={`vid-${idx}`} className="relative group aspect-square rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                        <video src={url} className="w-full h-full object-cover" />
                        <VideoIcon className="absolute h-7 w-7 text-white drop-shadow" />
                        <button
                          type="button"
                          onClick={() => setVideos((p) => p.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SCHEDULE */}
            {currentKey === "schedule" && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Confirm your contact details. Tenants will reach you on this number.
                </p>
                <div className="space-y-1">
                  <Label>Contact Number *</Label>
                  <Input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                  <div className="font-semibold mb-2">Listing summary</div>
                  <ul className="grid grid-cols-2 gap-y-1 text-muted-foreground">
                    <li>Title: <span className="text-foreground">{title || "—"}</span></li>
                    <li>Type: <span className="text-foreground">{propertyType}</span></li>
                    <li>BHK: <span className="text-foreground">{bhk || "—"}</span></li>
                    <li>Area: <span className="text-foreground">{builtUpArea ? `${builtUpArea} sqft` : "—"}</span></li>
                    <li>City: <span className="text-foreground">{city || "—"}</span></li>
                    <li>Locality: <span className="text-foreground">{locality || "—"}</span></li>
                    <li>Rent: <span className="text-foreground">{price ? `₹${price}` : "—"}</span></li>
                    <li>Photos: <span className="text-foreground">{images.length + videos.length}</span></li>
                  </ul>
                </div>
              </div>
            )}

            {/* Footer Nav */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t">
              <Button variant="outline" onClick={goBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {stepIdx === 0 ? "Cancel" : "Back"}
              </Button>
              {stepIdx < STEPS.length - 1 ? (
                <Button className="bg-primary text-primary-foreground" onClick={goNext}>
                  Save & Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button className="bg-primary text-primary-foreground" onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Post Property
                </Button>
              )}
            </div>
          </section>

          {/* Right promo card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-background border rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-primary text-center">Get Tenants Faster</h3>
              <p className="text-xs text-muted-foreground text-center mt-1 mb-4">
                Subscribe to our owner plans and find tenants quickly and with ease
              </p>

              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    icon: ShieldCheck,
                    label: "Privacy",
                    q: "What stays private?",
                    items: [
                      "Your phone number is masked from public view",
                      "Choose preferred contact hours",
                      "Hide exact flat / door number on listing",
                      "Allow contact only from verified tenants",
                    ],
                  },
                  {
                    icon: Star,
                    label: "Promoted Listing",
                    q: "What do we need to promote your listing?",
                    items: [
                      "High quality photos (min 5) and a short walkthrough video",
                      "Complete amenities and society details",
                      "Accurate rent, deposit and availability date",
                      "A short, catchy property description",
                    ],
                  },
                  {
                    icon: TrendingUp,
                    label: "Social Marketing",
                    q: "What we'll use for social ads?",
                    items: [
                      "Cover photo and 2–3 highlight images",
                      "One-line headline (e.g. 2BHK near Metro)",
                      "Target locality and tenant preference",
                      "Owner consent to run paid promotions",
                    ],
                  },
                  {
                    icon: Sparkles,
                    label: "Price Consultation",
                    q: "What helps us suggest the right price?",
                    items: [
                      "Built-up area and configuration (BHK)",
                      "Furnishing status and age of property",
                      "Floor, facing and parking details",
                      "Expected rent and deposit range",
                    ],
                  },
                ].map((b) => (
                  <AccordionItem key={b.label} value={b.label} className="border rounded-lg mb-2 px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2 text-left">
                        <b.icon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm font-semibold">{b.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs font-medium text-foreground mb-2">{b.q}</p>
                      <ul className="space-y-1.5">
                        {b.items.map((it) => (
                          <li key={it} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Button className="w-full mt-4 bg-primary text-primary-foreground">Show Interest</Button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ── Reusable: Counter ─────────────────────────────────────────────────────────
const Counter = ({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) => (
  <div className="flex items-center border rounded-md h-10">
    <button
      type="button"
      className="px-3 h-full text-muted-foreground hover:text-primary"
      onClick={() => onChange(Math.max(min, value - 1))}
    >
      <Minus className="h-4 w-4" />
    </button>
    <div className="flex-1 text-center text-sm font-medium">{value}</div>
    <button
      type="button"
      className="px-3 h-full text-muted-foreground hover:text-primary"
      onClick={() => onChange(value + 1)}
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
);

// ── Reusable: Yes/No toggle ───────────────────────────────────────────────────
const YesNo = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "Yes" | "No" | "";
  onChange: (v: "Yes" | "No") => void;
}) => (
  <div className="flex items-center justify-between border rounded-md px-3 py-2">
    <span className="text-sm font-medium">{label}</span>
    <div className="flex gap-1">
      {(["No", "Yes"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-xs rounded border transition-colors ${
            value === opt
              ? opt === "Yes"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-destructive/10 text-destructive border-destructive/40"
              : "bg-background hover:bg-muted"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default PostProperty;
