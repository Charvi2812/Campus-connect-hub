import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter, Sparkles } from "lucide-react";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "event", label: "Events" },
    { value: "hackathon", label: "Hackathons" },
  ];

  // No default events - events are created by organizations only
  const events: any[] = [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-campus-coral/5 via-background to-primary/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Calendar className="w-3 h-3 mr-1" /> Events & Hackathons
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover <span className="text-gradient-accent">Campus Events</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Find hackathons, workshops, and events happening at SRM. Register, attend, and get automatic OD.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filters */}
            <div className="flex gap-2">
              {eventTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className="rounded-full"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 bg-background min-h-[50vh]">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{events.length}</span> events
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>
                {selectedType === "all" ? "All Types" : 
                  eventTypes.find(t => t.value === selectedType)?.label}
              </span>
            </div>
          </div>

          {/* Empty State - No default events */}
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-campus-purple/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-2xl text-foreground mb-3">
              No Events Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Events are created exclusively by verified organizations and clubs. Check back soon for upcoming hackathons, workshops, and campus events!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" asChild>
                <a href="/clubs">Explore Clubs</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/auth">Sign Up for Updates</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">Browse & Register</h4>
                <p className="text-sm text-muted-foreground">
                  Find events that interest you and register with just one click.
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-campus-coral/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-campus-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">Scan QR Attendance</h4>
                <p className="text-sm text-muted-foreground">
                  Mark your attendance by scanning QR codes at the venue.
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-campus-teal/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-campus-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">Auto OD Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Get automatic OD for eligible events based on your attendance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
