import { useState } from "react";
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
  Building2,
  MapPin,
  BedDouble,
  Utensils,
  Sparkles,
  Image as ImageIcon,
  Phone,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
  Video as VideoIcon,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { api, uploadMediaToCloudinary } from "@/lib/api";

const STEPS = [
  { key: "pg", label: "PG Details", icon: Building2 },
  { key: "locality", label: "Locality", icon: MapPin },
  { key: "rooms", label: "Rooms & Sharing", icon: BedDouble },
  { key: "rules", label: "Rules & Meals", icon: Utensils },
  { key: "amenities", label: "Amenities", icon: Sparkles },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "contact", label: "Contact", icon: Phone },
] as const;

const PG_FOR = ["Boys", "Girls", "Anyone", "Colive"];
const SHARING = ["Single", "Double", "Triple", "Four", "Dormitory"];
const MEAL_TIMES = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const NOTICE = ["15 days", "1 month", "2 months", "3 months"];
const PG_AMENITIES = [
  "Wi-Fi", "AC", "Geyser", "Refrigerator", "Washing Machine", "TV",
  "Power Backup", "Lift", "Parking", "Housekeeping", "CCTV", "Hot Water",
  "Drinking Water", "Cooler", "Wardrobe", "Study Table",
];

const PostPg = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [stepIdx, setStepIdx] = useState(0);

  // PG details
  const [pgName, setPgName] = useState("");
  const [pgFor, setPgFor] = useState("Anyone");
  const [totalBeds, setTotalBeds] = useState(10);
  const [availableBeds, setAvailableBeds] = useState(5);
  const [propertyAge, setPropertyAge] = useState("");

  // Locality
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");

  // Rooms
  const [sharingTypes, setSharingTypes] = useState<string[]>([]);
  const [rentSingle, setRentSingle] = useState("");
  const [rentDouble, setRentDouble] = useState("");
  const [rentTriple, setRentTriple] = useState("");
  const [deposit, setDeposit] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("1 month");
  const [attachedBathroom, setAttachedBathroom] = useState(true);
  const [acRooms, setAcRooms] = useState(false);

  // Rules & meals
  const [mealsIncluded, setMealsIncluded] = useState(true);
  const [mealTimes, setMealTimes] = useState<string[]>(["Breakfast", "Dinner"]);
  const [vegOnly, setVegOnly] = useState(true);
  const [gateClosing, setGateClosing] = useState("22:00");
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [drinkingAllowed, setDrinkingAllowed] = useState(false);
  const [guestsAllowed, setGuestsAllowed] = useState(true);
  const [oppositeSex, setOppositeSex] = useState(false);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Gallery
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Contact
  const [contactNumber, setContactNumber] = useState(user?.phoneNumber ?? "");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const progress = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({ title: `${file.name} too large`, variant: "destructive" });
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
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const validate = (idx: number): boolean => {
    switch (STEPS[idx].key) {
      case "pg":
        if (!pgName.trim()) {
          toast({ title: "Enter PG / Hostel name", variant: "destructive" });
          return false;
        }
        return true;
      case "locality":
        if (!city.trim() || !locality.trim()) {
          toast({ title: "Enter City and Locality", variant: "destructive" });
          return false;
        }
        return true;
      case "rooms":
        if (sharingTypes.length === 0) {
          toast({ title: "Select at least one sharing type", variant: "destructive" });
          return false;
        }
        if (!rentSingle && !rentDouble && !rentTriple) {
          toast({ title: "Enter rent for at least one sharing type", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!validate(stepIdx)) return;
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
  };
  const goBack = () => (stepIdx === 0 ? navigate("/post-property") : setStepIdx(stepIdx - 1));

  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      if (!validate(i)) {
        setStepIdx(i);
        return;
      }
    }
    setSaving(true);
    try {
      const lowestRent = [rentSingle, rentDouble, rentTriple]
        .map((r) => Number(r))
        .filter((n) => n > 0)
        .sort((a, b) => a - b)[0] ?? 0;

      const property = await api.createProperty({
        title: pgName.trim(),
        type: "PG",
        city: city.trim(),
        locality: [locality.trim(), landmark.trim()].filter(Boolean).join(", "),
        price: lowestRent,
        beds: totalBeds,
        contactNumber: contactNumber.trim() || undefined,
        description:
          description.trim() ||
          `PG for ${pgFor}. Sharing: ${sharingTypes.join(", ")}. Meals ${mealsIncluded ? "included" : "not included"}.`,
        amenities: selectedAmenities.length ? selectedAmenities : undefined,
        images: [...images, ...videos],
      });
      toast({ title: "PG Listed!", description: "Your PG is now live." });
      navigate(`/property/${property.id}`);
    } catch (err) {
      toast({
        title: "Failed to post PG",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Login required</h1>
          <p className="text-muted-foreground mb-6">Please log in as an Owner to post a PG.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const currentKey = STEPS[stepIdx].key;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />

      <div className="border-b bg-background">
        <div className="container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">PG</div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold truncate">Post Your PG / Hostel</h1>
              <p className="text-xs text-muted-foreground">Free listing • Verified leads</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-semibold text-primary">{progress}% Done</span>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
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

          <section className="bg-background border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-6">{STEPS[stepIdx].label}</h2>

            {currentKey === "pg" && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <Label>PG / Hostel Name *</Label>
                  <Input value={pgName} onChange={(e) => setPgName(e.target.value)} placeholder="e.g. Sunrise Boys PG" />
                </div>
                <div>
                  <Label className="block mb-2">PG is for</Label>
                  <div className="flex flex-wrap gap-2">
                    {PG_FOR.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPgFor(p)}
                        className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                          pgFor === p ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Total Beds</Label>
                    <Counter value={totalBeds} onChange={setTotalBeds} min={1} />
                  </div>
                  <div className="space-y-1">
                    <Label>Available Beds</Label>
                    <Counter value={availableBeds} onChange={setAvailableBeds} min={0} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Property Age</Label>
                  <Select value={propertyAge} onValueChange={setPropertyAge}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["< 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentKey === "locality" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>City *</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Bangalore" />
                  </div>
                  <div className="space-y-1">
                    <Label>Locality *</Label>
                    <Input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g. Koramangala" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Landmark / Street</Label>
                  <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Near Forum Mall" />
                </div>
              </div>
            )}

            {currentKey === "rooms" && (
              <div className="space-y-5">
                <div>
                  <Label className="block mb-2">Sharing Type *</Label>
                  <div className="flex flex-wrap gap-2">
                    {SHARING.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSharingTypes((p) => toggle(p, s))}
                        className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                          sharingTypes.includes(s)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Rent — Single (₹/mo)</Label>
                    <Input type="number" value={rentSingle} onChange={(e) => setRentSingle(e.target.value)} placeholder="₹ 12000" />
                  </div>
                  <div className="space-y-1">
                    <Label>Rent — Double (₹/mo)</Label>
                    <Input type="number" value={rentDouble} onChange={(e) => setRentDouble(e.target.value)} placeholder="₹ 8000" />
                  </div>
                  <div className="space-y-1">
                    <Label>Rent — Triple (₹/mo)</Label>
                    <Input type="number" value={rentTriple} onChange={(e) => setRentTriple(e.target.value)} placeholder="₹ 6000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Security Deposit</Label>
                    <Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="₹ 10000" />
                  </div>
                  <div className="space-y-1">
                    <Label>Notice Period</Label>
                    <Select value={noticePeriod} onValueChange={setNoticePeriod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {NOTICE.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                    <Checkbox checked={attachedBathroom} onCheckedChange={(v) => setAttachedBathroom(!!v)} />
                    Attached Bathroom
                  </label>
                  <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                    <Checkbox checked={acRooms} onCheckedChange={(v) => setAcRooms(!!v)} />
                    AC Rooms Available
                  </label>
                </div>
              </div>
            )}

            {currentKey === "rules" && (
              <div className="space-y-5">
                <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                  <Checkbox checked={mealsIncluded} onCheckedChange={(v) => setMealsIncluded(!!v)} />
                  Meals Included in Rent
                </label>

                {mealsIncluded && (
                  <>
                    <div>
                      <Label className="block mb-2">Meals Provided</Label>
                      <div className="flex flex-wrap gap-2">
                        {MEAL_TIMES.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMealTimes((p) => toggle(p, m))}
                            className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                              mealTimes.includes(m)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                      <Checkbox checked={vegOnly} onCheckedChange={(v) => setVegOnly(!!v)} />
                      Veg Only
                    </label>
                  </>
                )}

                <div className="space-y-1">
                  <Label>Gate Closing Time</Label>
                  <Input type="time" value={gateClosing} onChange={(e) => setGateClosing(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                    <Checkbox checked={smokingAllowed} onCheckedChange={(v) => setSmokingAllowed(!!v)} />
                    Smoking Allowed
                  </label>
                  <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                    <Checkbox checked={drinkingAllowed} onCheckedChange={(v) => setDrinkingAllowed(!!v)} />
                    Drinking Allowed
                  </label>
                  <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                    <Checkbox checked={guestsAllowed} onCheckedChange={(v) => setGuestsAllowed(!!v)} />
                    Guests Allowed
                  </label>
                  <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer">
                    <Checkbox checked={oppositeSex} onCheckedChange={(v) => setOppositeSex(!!v)} />
                    Opposite Sex Visitors Allowed
                  </label>
                </div>
              </div>
            )}

            {currentKey === "amenities" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select the amenities available at your PG.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PG_AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedAmenities.includes(a)}
                        onCheckedChange={() => setSelectedAmenities((p) => toggle(p, a))}
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentKey === "gallery" && (
              <div className="space-y-4">
                <Label>PG Photos & Videos</Label>
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

            {currentKey === "contact" && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <Label>Contact Number *</Label>
                  <Input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-1">
                  <Label>About the PG</Label>
                  <Textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your PG, nearby facilities, the kind of crowd..."
                  />
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                  <div className="font-semibold mb-2">Listing summary</div>
                  <ul className="grid grid-cols-2 gap-y-1 text-muted-foreground">
                    <li>Name: <span className="text-foreground">{pgName || "—"}</span></li>
                    <li>For: <span className="text-foreground">{pgFor}</span></li>
                    <li>City: <span className="text-foreground">{city || "—"}</span></li>
                    <li>Locality: <span className="text-foreground">{locality || "—"}</span></li>
                    <li>Beds: <span className="text-foreground">{availableBeds}/{totalBeds}</span></li>
                    <li>Sharing: <span className="text-foreground">{sharingTypes.join(", ") || "—"}</span></li>
                    <li>Meals: <span className="text-foreground">{mealsIncluded ? "Included" : "Not included"}</span></li>
                    <li>Photos: <span className="text-foreground">{images.length + videos.length}</span></li>
                  </ul>
                </div>
              </div>
            )}

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
                  Post PG
                </Button>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

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

export default PostPg;
