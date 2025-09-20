import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Heart, Phone, MessageCircle } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  beds?: number;
  baths?: number;
  area?: number;
  image: string;
  verified: boolean;
  featured?: boolean;
}

const PropertyCard = ({
  title,
  location,
  price,
  type,
  beds,
  baths,
  area,
  image,
  verified,
  featured,
}: PropertyCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-medium cursor-pointer">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
          {verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified
            </Badge>
          )}
        </div>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-soft hover:bg-white transition-colors">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">{price}</div>
            <Badge variant="outline">{type}</Badge>
          </div>

          {(beds || baths || area) && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {beds && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {beds} Beds
                </div>
              )}
              {baths && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {baths} Baths
                </div>
              )}
              {area && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  {area} sqft
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
        <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground shadow-soft">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;