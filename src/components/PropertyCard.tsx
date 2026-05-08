import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart, CheckCircle, Phone, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  beds?: number;
  baths?: number;
  area?: number;
  images?: string[];
  image?: string;
  verified?: boolean;
  featured?: boolean;
  contactNumber?: string;
  ownerName?: string;
  amenities?: string[];
  postedAt?: string;
}

const PropertyCard = ({
  id, title, location, price, type, beds, baths, area,
  images, image, verified, featured, contactNumber, ownerName, amenities = [], postedAt,
}: PropertyCardProps) => {
  const allImages = images?.length ? images : image ? [image] : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"];
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const prevImg = (e: React.MouseEvent) => { e.preventDefault(); setImgIndex((i) => (i - 1 + allImages.length) % allImages.length); };
  const nextImg = (e: React.MouseEvent) => { e.preventDefault(); setImgIndex((i) => (i + 1) % allImages.length); };

  const whatsappNumber = contactNumber?.replace(/\D/g, "");
  const visibleAmenities = amenities.slice(0, 3);
  const extraAmenities = amenities.length - 3;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-medium transition-all duration-200 group flex flex-col h-full">
      {/* Image */}
      <Link to={`/property/${id}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img src={allImages[imgIndex]} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {verified && (
              <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            )}
            {featured && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">Featured</span>
            )}
          </div>

          <span className="absolute top-3 right-12 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">{type}</span>

          <button onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors">
            <Heart className={`h-4 w-4 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>

          {allImages.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">{imgIndex + 1}/{allImages.length}</span>
            </>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0 gap-3">
        <div className="space-y-2">
          <Link to={`/property/${id}`}>
            <h3 className="font-semibold text-base leading-snug hover:text-primary transition-colors line-clamp-2">{title}</h3>
          </Link>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-primary">{price}</span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
            <span className="truncate">{location}</span>
          </p>

          {(beds != null || baths != null || area != null) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              {beds != null && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {beds} {beds === 1 ? "Bed" : "Beds"}</span>}
              {baths != null && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {baths} {baths === 1 ? "Bath" : "Baths"}</span>}
              {area != null && <span className="flex items-center gap-1"><Square className="h-3.5 w-3.5" /> {area.toLocaleString("en-IN")} sqft</span>}
            </div>
          )}

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {visibleAmenities.map((a) => (
                <span key={a} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full border border-border">{a}</span>
              ))}
              {extraAmenities > 0 && (
                <span className="bg-primary-lightest text-primary text-xs px-2 py-0.5 rounded-full border border-primary/20 font-medium">+{extraAmenities}</span>
              )}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-border gap-2 flex-wrap">
          <div className="text-xs text-muted-foreground truncate min-w-0 flex-1">
            {ownerName
              ? <span>By <span className="font-medium text-foreground">{ownerName}</span></span>
              : postedAt ? <span>Updated {postedAt}</span> : <span className="text-primary">Available Now</span>
            }
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {contactNumber ? (
              <a href={`tel:${contactNumber}`} onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="text-xs h-8 px-2.5 border-primary text-primary hover:bg-primary/5">
                  <Phone className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : (
              <Link to={`/property/${id}`}>
                <Button variant="outline" size="sm" className="text-xs h-8 px-2.5 border-primary text-primary hover:bg-primary/5">
                  <Phone className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}

            {whatsappNumber ? (
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" className="text-xs h-8 px-2.5 bg-green-500 hover:bg-green-600 text-white border-0">
                  <MessageCircle className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : (
              <Link to={`/property/${id}`}>
                <Button size="sm" className="text-xs h-8 px-2.5 bg-green-500 hover:bg-green-600 text-white border-0">
                  <MessageCircle className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
