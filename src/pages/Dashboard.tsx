import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateEventForm } from "@/components/forms/CreateEventForm";
import { EventCard } from "@/components/cards/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarDays, 
  Users, 
  Loader2,
  ShieldCheck,
  Building2
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [organizerName, setOrganizerName] = useState("");
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      navigate("/auth");
      return;
    }

    // Fetch user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    const role = roleData?.role || "student";
    setUserRole(role);

    // Check if user can access dashboard
    if (!["organization", "admin", "faculty"].includes(role)) {
      toast({
        title: "Access denied",
        description: "You need organization or admin privileges to access the dashboard.",
        variant: "destructive",
      });
      navigate("/events");
      return;
    }

    // Get profile for organizer name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", session.user.id)
      .single();

    setOrganizerName(profile?.full_name || session.user.email || "Organization");

    // Fetch events created by this organizer
    fetchMyEvents(profile?.full_name || "");
    setLoading(false);
  };

  const fetchMyEvents = async (name: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_name", name)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMyEvents(data);
    }
  };

  const handleEventCreated = () => {
    setActiveTab("events");
    fetchMyEvents(organizerName);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-campus-purple/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                <Building2 className="w-3 h-3 mr-1" />
                {userRole === "admin" ? "Admin" : userRole === "faculty" ? "Faculty" : "Organization"}
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Welcome, <span className="text-gradient">{organizerName}</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your events and view registrations
              </p>
            </div>
            <Button variant="hero" onClick={() => setActiveTab("create")}>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <CalendarPlus className="w-4 h-4" />
                Create Event
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                My Events
              </TabsTrigger>
              {(userRole === "admin" || userRole === "faculty") && (
                <TabsTrigger value="od" className="gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  OD Requests
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Events</CardDescription>
                    <CardTitle className="text-3xl font-display">{myEvents.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Events you've created</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardDescription>Upcoming</CardDescription>
                    <CardTitle className="text-3xl font-display">
                      {myEvents.filter(e => new Date(e.start_date) >= new Date()).length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Events in the future</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardDescription>OD Eligible</CardDescription>
                    <CardTitle className="text-3xl font-display">
                      {myEvents.filter(e => e.is_od_eligible).length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Events with OD enabled</p>
                  </CardContent>
                </Card>
              </div>

              {myEvents.length === 0 && (
                <Card className="mt-8 border-dashed">
                  <CardContent className="py-12 text-center">
                    <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">No events yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first event to get started
                    </p>
                    <Button variant="hero" onClick={() => setActiveTab("create")}>
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="create">
              <div className="max-w-2xl">
                <CreateEventForm 
                  organizerName={organizerName}
                  onSuccess={handleEventCreated}
                />
              </div>
            </TabsContent>

            <TabsContent value="events">
              {myEvents.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">No events created</h3>
                    <p className="text-muted-foreground">
                      Events you create will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      description={event.description || ""}
                      organizerName={event.organizer_name}
                      startDate={event.start_date}
                      endDate={event.end_date}
                      startTime={event.event_start_time}
                      endTime={event.event_end_time}
                      venueName={event.venue_name || undefined}
                      registrationLink={event.registration_link || undefined}
                      isOdEligible={event.is_od_eligible}
                      qrEnabled={event.qr_enabled}
                      eventType={event.event_type}
                      bannerUrl={event.banner_url || undefined}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="od">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display">OD Requests</CardTitle>
                  <CardDescription>
                    Review and approve On-Duty requests from students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>OD requests will appear here when students mark attendance</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
