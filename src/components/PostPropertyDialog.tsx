import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Loader2, Upload, X, Video as VideoIcon } from "lucide-react";
import { api, type PropertyType, uploadMediaToCloudinary } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface PostPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PROPERTY_TYPES: PropertyType[] = ["PG", "ROOM", "APARTMENT", "FLAT", "VILLA", "COMMERCIAL"];

const ALL_AMENITIES = [
  "Swimming Pool", "Gym", "Parking", "Garden", "Play Area", "Security",
  "Clubhouse", "Power Backup", "Lift", "CCTV Surveillance", "Intercom Facility",
  "Fire Safety", "Jogging Track", "Wi-Fi Connectivity", "Indoor Games Room",
  "Modular Kitchen", "Air Conditioning", "Gas Pipeline",
];

const PostPropertyDialog = ({ open, onOpenChange }: PostPropertyDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");

  // Step 2
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [price, setPrice] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Step 3
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Media
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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
        if (isVideo) setVideos((prev) => [...prev, url]);
        else setImages((prev) => [...prev, url]);
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

  const reset = () => {
    setStep(1);
    setTitle(""); setPropertyType("APARTMENT"); setCity(""); setLocality("");
    setBeds(""); setBaths(""); setSquareFeet(""); setPrice(""); setContactNumber("");
    setDescription(""); setSelectedAmenities([]);
    setImages([]); setVideos([]);
  };

  const handleClose = () => { reset(); onOpenChange(false); };

  const validateStep1 = () => {
    if (!title.trim() || !city.trim() || !locality.trim()) {
      toast({ title: "Please fill in Title, City, and Locality", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!price || Number(price) <= 0) {
      toast({ title: "Please enter a valid rent amount", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSaving(true);
    try {
      const property = await api.createProperty({
        title: title.trim(),
        type: propertyType,
        city: city.trim(),
        locality: locality.trim(),
        price: Number(price),
        beds: beds ? Number(beds) : undefined,
        baths: baths ? Number(baths) : undefined,
        squareFeet: squareFeet ? Number(squareFeet) : undefined,
        contactNumber: contactNumber.trim() || undefined,
        description: description.trim() || undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      });

      toast({
        title: "Property Listed!",
        description: "Your property is now live on RentPeRazi.",
      });

      handleClose();
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

  return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post a Property — Step {step} of 3</DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
                <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                        s <= step ? "bg-primary" : "bg-muted"
                    }`}
                />
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Property Title *</Label>
                  <Input
                      placeholder="e.g. Modern 2BHK Apartment"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <Label>Property Type *</Label>
                  <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>City *</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Locality *</Label>
                    <Input value={locality} onChange={(e) => setLocality(e.target.value)} />
                  </div>
                </div>
              </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Input type="number" placeholder="Beds" value={beds} onChange={(e) => setBeds(e.target.value)} />
                  <Input type="number" placeholder="Baths" value={baths} onChange={(e) => setBaths(e.target.value)} />
                  <Input type="number" placeholder="Sq.ft" value={squareFeet} onChange={(e) => setSquareFeet(e.target.value)} />
                </div>

                <Input type="number" placeholder="Monthly Rent" value={price} onChange={(e) => setPrice(e.target.value)} />
                <Input type="tel" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
              <div className="space-y-4">
                <Textarea
                    rows={4}
                    placeholder="Describe your property..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {ALL_AMENITIES.map((a) => (
                      <div key={a} className="flex items-center space-x-2">
                        <Checkbox
                            checked={selectedAmenities.includes(a)}
                            onCheckedChange={() => toggleAmenity(a)}
                        />
                        <label className="text-sm">{a}</label>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
                variant="outline"
                onClick={step === 1 ? handleClose : () => setStep((s) => s - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < 3 ? (
                <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleNext}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            ) : (
                <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Post Property
                </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default PostPropertyDialog;