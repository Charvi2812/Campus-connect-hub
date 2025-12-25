import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, ExternalLink, Bookmark, QrCode } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  eventType: "event" | "hackathon";
  organizerName: string;
  venueName?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationLink?: string;
  bannerUrl?: string;
  isOdEligible?: boolean;
  qrEnabled?: boolean;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export function EventCard({
  id,
  title,
  description,
  eventType,
  organizerName,
  venueName,
  startDate,
  endDate,
  startTime,
  endTime,
  registrationLink,
  bannerUrl,
  isOdEligible,
  qrEnabled,
  isBookmarked,
  onBookmark,
}: EventCardProps) {
  const isHackathon = eventType === "hackathon";
  const isSameDay = startDate === endDate;
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      {/* Banner */}
      <div className={cn(
        "h-32 relative overflow-hidden",
        isHackathon 
          ? "bg-gradient-to-br from-primary via-campus-purple to-campus-rose"
          : "bg-gradient-to-br from-campus-coral via-campus-gold to-campus-rose"
      )}>
        {bannerUrl && (
          <img 
            src={bannerUrl} 
            alt={title}
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={isHackathon ? "hackathon" : "event"} className="bg-white/90 backdrop-blur-sm">
            {isHackathon ? "🚀 Hackathon" : "📅 Event"}
          </Badge>
          {isOdEligible && (
            <Badge variant="od" className="bg-white/90 backdrop-blur-sm">
              OD Eligible
            </Badge>
          )}
        </div>

        {/* Bookmark button */}
        {onBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Bookmark className={cn("w-4 h-4", isBookmarked ? "fill-primary text-primary" : "text-muted-foreground")} />
          </button>
        )}
      </div>

      <CardContent className="p-5">
        {/* Title & Organizer */}
        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          by {organizerName}
        </p>

        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              {isSameDay 
                ? format(new Date(startDate), "EEE, MMM d, yyyy")
                : `${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d, yyyy")}`
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
          {venueName && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground truncate">{venueName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {registrationLink ? (
            <Button 
              variant={isHackathon ? "hero" : "coral"} 
              size="sm" 
              className="flex-1"
              asChild
            >
              <a href={registrationLink} target="_blank" rel="noopener noreferrer">
                Register <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="flex-1" disabled>
              Registration Closed
            </Button>
          )}
          {qrEnabled && (
            <Button variant="outline" size="icon" className="shrink-0">
              <QrCode className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
