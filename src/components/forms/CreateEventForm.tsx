import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarDays, Clock, MapPin, Link as LinkIcon, FileText, Users } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  event_type: z.enum(["event", "hackathon"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  event_start_time: z.string().min(1, "Start time is required"),
  event_end_time: z.string().min(1, "End time is required"),
  venue_name: z.string().min(2, "Venue is required").max(200),
  registration_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  max_participants: z.coerce.number().min(1).optional().or(z.literal("")),
  is_od_eligible: z.boolean(),
  qr_enabled: z.boolean(),
  minimum_attendance_minutes: z.coerce.number().min(15).max(480),
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventFormProps {
  organizerName: string;
  organizerId?: string;
  onSuccess?: () => void;
}

export function CreateEventForm({ organizerName, organizerId, onSuccess }: CreateEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      event_type: "event",
      start_date: "",
      end_date: "",
      event_start_time: "",
      event_end_time: "",
      venue_name: "",
      registration_link: "",
      is_od_eligible: false,
      qr_enabled: true,
      minimum_attendance_minutes: 45,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("events").insert({
        title: data.title.trim(),
        description: data.description.trim(),
        event_type: data.event_type,
        start_date: data.start_date,
        end_date: data.end_date,
        event_start_time: data.event_start_time,
        event_end_time: data.event_end_time,
        venue_name: data.venue_name.trim(),
        registration_link: data.registration_link || null,
        max_participants: data.max_participants || null,
        is_od_eligible: data.is_od_eligible,
        qr_enabled: data.qr_enabled,
        minimum_attendance_minutes: data.minimum_attendance_minutes,
        organizer_name: organizerName,
        organizer_id: organizerId || null,
        is_published: true,
      });

      if (error) throw error;

      toast({
        title: "Event created!",
        description: "Your event has been published successfully.",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Failed to create event",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Create New Event
        </CardTitle>
        <CardDescription>
          Fill in the details to publish your event for students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="TechFest 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Venue
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Main Auditorium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your event..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Start Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Start Time
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Registration */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="registration_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Registration Link
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://forms.google.com/..." {...field} />
                    </FormControl>
                    <FormDescription>Google Form or external registration</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Max Participants
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormDescription>Leave empty for unlimited</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Settings */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border/50">
              <h4 className="font-medium text-sm">Event Settings</h4>
              
              <FormField
                control={form.control}
                name="qr_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Enable QR Attendance</FormLabel>
                      <FormDescription>Students scan QR to mark attendance</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_od_eligible"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>OD Eligible</FormLabel>
                      <FormDescription>Auto-generate OD for valid attendance</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimum_attendance_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Attendance (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min={15} max={480} {...field} />
                    </FormControl>
                    <FormDescription>Required for OD eligibility</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Publish Event"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
