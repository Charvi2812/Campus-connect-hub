import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Users, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubCardProps {
  name: string;
  description?: string;
  category: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  joinFormUrl?: string;
  logoUrl?: string;
}

const categoryIcons: Record<string, string> = {
  technical: "💻",
  cultural: "🎭",
  sports: "⚽",
  social_service: "🤝",
  literary: "📚",
  photography: "📷",
  esports: "🎮",
  debate: "🎤",
};

const categoryLabels: Record<string, string> = {
  technical: "Technical",
  cultural: "Cultural",
  sports: "Sports",
  social_service: "Social Service",
  literary: "Literary",
  photography: "Photography",
  esports: "E-Sports",
  debate: "Debate",
};

export function ClubCard({
  name,
  description,
  category,
  coordinatorName,
  coordinatorEmail,
  coordinatorPhone,
  joinFormUrl,
  logoUrl,
}: ClubCardProps) {
  const categoryKey = category.toLowerCase().replace(/[- ]/g, "_");
  
  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Club Icon/Logo */}
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0",
            "bg-gradient-to-br from-primary/10 to-campus-purple/10 group-hover:from-primary/20 group-hover:to-campus-purple/20 transition-colors"
          )}>
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-10 h-10 object-contain" />
            ) : (
              <span>{categoryIcons[categoryKey] || "🎯"}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display font-semibold text-lg text-foreground truncate">
                {name}
              </h3>
              <Badge variant={categoryKey as any} className="shrink-0">
                {categoryLabels[categoryKey] || category}
              </Badge>
            </div>

            {description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}

            {/* Coordinator Info */}
            {coordinatorName && (
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{coordinatorName}</span>
                </div>
                {coordinatorEmail && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{coordinatorEmail}</span>
                  </div>
                )}
                {coordinatorPhone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{coordinatorPhone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Join Button */}
            {joinFormUrl ? (
              <Button 
                variant="hero" 
                size="sm" 
                className="w-full"
                asChild
              >
                <a href={joinFormUrl} target="_blank" rel="noopener noreferrer">
                  Join Club <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            ) : (
              <Button variant="secondary" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
