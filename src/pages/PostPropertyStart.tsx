import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Users, Zap, Quote } from "lucide-react";

const CITIES = [
  "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai",
  "Kolkata", "Gurgaon", "Noida", "Ahmedabad",
];

const AD_TYPES = [
  { id: "rent", label: "Rent", desc: "List your flat for monthly rent" },
  { id: "pg", label: "PG / Hostel", desc: "List beds in a PG or hostel" },
  { id: "flatmates", label: "Flatmates", desc: "Find a flatmate to share with" },
] as const;

type AdType = (typeof AD_TYPES)[number]["id"];

const PostPropertyStart = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("Bangalore");
  const [whatsapp, setWhatsapp] = useState(true);
  const [adType, setAdType] = useState<AdType>("rent");

  const handleStart = () => {
    if (adType === "pg") {
      navigate(`/post-property/pg?city=${encodeURIComponent(city)}`);
    } else {
      // Rent and Flatmates both use the flat journey
      navigate(`/post-property/flat?city=${encodeURIComponent(city)}&mode=${adType}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Sell or Rent your Property <span className="text-primary">For Free</span>
          </h1>
          <div className="hidden md:block text-sm bg-muted px-4 py-2 rounded-md">
            Looking for a property?{" "}
            <button
              onClick={() => navigate("/properties")}
              className="text-primary font-semibold underline-offset-4 hover:underline"
            >
              Click Here
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left info panel */}
          <aside className="bg-muted/40 border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Why Post through us?</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Zero Brokerage</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Faster Tenants</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>10 lac tenants / buyers connections</span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-5">
              <h4 className="font-semibold mb-2">30 Lac+ Home Owners Trust Us</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <Quote className="h-4 w-4 inline mr-1 text-primary" />
                This is a free property ad posting site that I have tried before. It helps me well and
                gets the right tenants for my properties. The 1st person identified by them has become
                the tenant!
              </p>
              <p className="text-xs font-semibold mt-3">Janardhana <span className="text-muted-foreground font-normal">| Bangalore</span></p>
            </div>
          </aside>

          {/* Right form panel */}
          <section className="bg-background border rounded-xl p-6 md:p-10 shadow-sm">
            <div className="max-w-md mx-auto space-y-7">
              {/* City */}
              <div>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm">Get updates on</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  <span className="inline-block h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">✓</span>
                  WhatsApp
                </span>
                <Switch checked={whatsapp} onCheckedChange={setWhatsapp} />
              </div>

              {/* Property Type — Residential only */}
              <div>
                <p className="text-center text-sm font-semibold mb-2">Property type</p>
                <div className="border-b">
                  <button
                    type="button"
                    className="w-full py-3 text-base font-semibold text-primary border-b-2 border-primary"
                  >
                    Residential
                  </button>
                </div>
              </div>

              {/* Ad type */}
              <div>
                <p className="text-center text-sm font-semibold mb-3">Select Property Ad Type</p>
                <div className="grid grid-cols-3 gap-2 border rounded-md p-2">
                  {AD_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAdType(t.id)}
                      title={t.desc}
                      className={`py-3 px-2 rounded-md text-sm font-semibold transition-colors ${
                        adType === t.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/70"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {AD_TYPES.find((t) => t.id === adType)?.desc}
                </p>
              </div>

              <Button
                onClick={handleStart}
                className="w-full h-12 text-base font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Start Posting Your Ad For FREE
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostPropertyStart;
