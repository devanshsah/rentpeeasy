import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostPropertyDialog = ({ open, onOpenChange }: PostPropertyDialogProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  // Form state
  const [listingType, setListingType] = useState("rent");
  const [propertyType, setPropertyType] = useState("residential");
  const [residentialType, setResidentialType] = useState("apartment");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [projectName, setProjectName] = useState("");
  const [bhkType, setBhkType] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [balconies, setBalconies] = useState("1");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("ready");
  const [propertyAge, setPropertyAge] = useState("0-1");
  const [roomType, setRoomType] = useState("private");
  const [suitableFor, setSuitableFor] = useState("both");
  const [availableFor, setAvailableFor] = useState("both");
  const [expectedRent, setExpectedRent] = useState("");
  const [bookingAmount, setBookingAmount] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenities = [
    "Swimming Pool", "Gym", "Parking", "Garden", "Play Area", "Security",
    "Clubhouse", "Power Backup", "Lift", "CCTV Surveillance", "Intercom Facility",
    "Fire Safety", "Jogging Track", "Rainwater Harvesting", "Children's Park",
    "Community Hall", "Waste Disposal", "Wi-Fi Connectivity", "Indoor Games Room",
    "Spa & Sauna", "Tennis Court", "Basketball Court", "Badminton Court",
    "Visitor Parking", "Laundry Service", "24/7 Water Supply", "Gated Community",
    "Solar Water Heating", "Library", "Shopping Complex", "ATM", "Pet Friendly",
    "Barbecue Area"
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    toast({
      title: "Property Posted Successfully!",
      description: "Your property has been listed and will be reviewed shortly.",
    });
    onOpenChange(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post Your Property</DialogTitle>
          <p className="text-muted-foreground">
            Step {step} of 5 - {["Basic Info", "Address Details", "Property Details", "Amenities & Others", "Upload Images"][step - 1]}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">I am looking to</Label>
                <div className="grid grid-cols-3 gap-4">
                  {["Sale", "Rent / Lease", "PG"].map((type) => (
                    <Button
                      key={type}
                      variant={listingType === type.toLowerCase().replace(" / ", "").replace(" ", "") ? "default" : "outline"}
                      onClick={() => setListingType(type.toLowerCase().replace(" / ", "").replace(" ", ""))}
                      className="h-20"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">What kind of property do you have?</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {propertyType === "residential" && (
                <div>
                  <Label className="text-base font-semibold mb-4 block">Residential Type</Label>
                  <Select value={residentialType} onValueChange={setResidentialType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="independenthouse">Independent House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Address Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="address">Search Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your property address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Jaipur"
                  />
                </div>

                <div>
                  <Label htmlFor="locality">Locality</Label>
                  <Input
                    id="locality"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g., Mansarovar"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="projectName">Project/Society Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project or society name"
                />
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {step === 3 && (
            <div className="space-y-6">
              {residentialType === "apartment" && listingType !== "pg" && (
                <div>
                  <Label className="text-base font-semibold mb-4 block">Your apartment is a</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["1", "2", "3", "4", "5", "6+"].map((bhk) => (
                      <Button
                        key={bhk}
                        variant={bhkType === bhk ? "default" : "outline"}
                        onClick={() => setBhkType(bhk)}
                      >
                        {bhk}BHK
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>No. of Bathrooms</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["1", "2", "3", "4", "5", "6+"].map((bath) => (
                      <Button
                        key={bath}
                        variant={bathrooms === bath ? "default" : "outline"}
                        onClick={() => setBathrooms(bath)}
                        size="sm"
                      >
                        {bath}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>No. of Balconies</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["0", "1", "2", "3", "4", "5+"].map((bal) => (
                      <Button
                        key={bal}
                        variant={balconies === bal ? "default" : "outline"}
                        onClick={() => setBalconies(bal)}
                        size="sm"
                      >
                        {bal}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="builtUpArea">Built-up Area (sq.ft.)</Label>
                <Input
                  id="builtUpArea"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  placeholder="1500"
                  type="number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floor">Property on the Floor</Label>
                  <Input
                    id="floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="2"
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="totalFloors">Total No. of Floors</Label>
                  <Input
                    id="totalFloors"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    placeholder="4"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Availability Status</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={availabilityStatus === "ready" ? "default" : "outline"}
                    onClick={() => setAvailabilityStatus("ready")}
                  >
                    Ready to Move
                  </Button>
                  <Button
                    variant={availabilityStatus === "construction" ? "default" : "outline"}
                    onClick={() => setAvailabilityStatus("construction")}
                  >
                    Under Construction
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Age of Property</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                    <Button
                      key={age}
                      variant={propertyAge === age.split(" ")[0] ? "default" : "outline"}
                      onClick={() => setPropertyAge(age.split(" ")[0])}
                    >
                      {age}
                    </Button>
                  ))}
                </div>
              </div>

              {listingType === "pg" && (
                <>
                  <div>
                    <Label className="text-base font-semibold mb-4 block">Room Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Private", "Twin Sharing", "Triple Sharing", "Quad Sharing"].map((type) => (
                        <Button
                          key={type}
                          variant={roomType === type.toLowerCase().replace(" ", "") ? "default" : "outline"}
                          onClick={() => setRoomType(type.toLowerCase().replace(" ", ""))}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-4 block">Suitable For</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Student", "Working Professionals", "Both"].map((type) => (
                        <Button
                          key={type}
                          variant={suitableFor === type.toLowerCase().replace(" ", "") ? "default" : "outline"}
                          onClick={() => setSuitableFor(type.toLowerCase().replace(" ", ""))}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-4 block">Available For</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Boys", "Girls", "Both"].map((type) => (
                        <Button
                          key={type}
                          variant={availableFor === type.toLowerCase() ? "default" : "outline"}
                          onClick={() => setAvailableFor(type.toLowerCase())}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="expectedRent">Expected Rent (per month)</Label>
                <Input
                  id="expectedRent"
                  value={expectedRent}
                  onChange={(e) => setExpectedRent(e.target.value)}
                  placeholder="9000"
                  type="number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bookingAmount">Booking Amount (Optional)</Label>
                  <Input
                    id="bookingAmount"
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(e.target.value)}
                    placeholder="3000"
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="maintenance">Maintenance (Optional)</Label>
                  <Input
                    id="maintenance"
                    value={maintenance}
                    onChange={(e) => setMaintenance(e.target.value)}
                    placeholder="2000"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">What makes your property unique</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Select Amenities</Label>
                <Button
                  variant="link"
                  onClick={() =>
                    selectedAmenities.length === amenities.length
                      ? setSelectedAmenities([])
                      : setSelectedAmenities(amenities)
                  }
                >
                  {selectedAmenities.length === amenities.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Upload Images */}
          {step === 5 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Upload Property Images</Label>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="images"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="text-4xl">📷</div>
                  <p className="text-muted-foreground">
                    Click to upload property images
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < 5 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit Property
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPropertyDialog;
