-- CampusConnect Database Schema

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'organization', 'faculty', 'admin');

-- Create event_type enum
CREATE TYPE public.event_type AS ENUM ('event', 'hackathon');

-- Create club_category enum
CREATE TYPE public.club_category AS ENUM ('technical', 'cultural', 'sports', 'social_service', 'literary', 'photography', 'esports', 'debate');

-- Create attendance_status enum
CREATE TYPE public.attendance_status AS ENUM ('pending', 'verified', 'invalid');

-- Create od_status enum
CREATE TYPE public.od_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  registration_number TEXT,
  branch TEXT,
  year INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Organizations table for verified clubs/organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Clubs table
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category club_category NOT NULL,
  logo_url TEXT,
  coordinator_name TEXT,
  coordinator_email TEXT,
  coordinator_phone TEXT,
  join_form_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL DEFAULT 'event',
  organizer_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  organizer_name TEXT NOT NULL,
  venue_name TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  event_start_time TIME NOT NULL,
  event_end_time TIME NOT NULL,
  registration_link TEXT,
  banner_url TEXT,
  is_od_eligible BOOLEAN DEFAULT false NOT NULL,
  minimum_attendance_minutes INTEGER DEFAULT 45 NOT NULL,
  qr_enabled BOOLEAN DEFAULT false NOT NULL,
  max_participants INTEGER,
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Event registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Event attendance table (QR-based)
CREATE TABLE public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE,
  exit_time TIMESTAMP WITH TIME ZONE,
  attendance_status attendance_status DEFAULT 'pending' NOT NULL,
  qr_scan_count INTEGER DEFAULT 0 NOT NULL,
  total_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- OD List table
CREATE TABLE public.od_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  attendance_id UUID REFERENCES public.event_attendance(id) ON DELETE CASCADE,
  class_date DATE NOT NULL,
  status od_status DEFAULT 'pending' NOT NULL,
  faculty_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, event_id, class_date)
);

-- Club memberships table
CREATE TABLE public.club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(club_id, user_id)
);

-- Bookmarked events table
CREATE TABLE public.event_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.od_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookmarks ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  
  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.event_attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_od_list_updated_at
  BEFORE UPDATE ON public.od_list
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can view all profiles, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: Viewable by authenticated users, only admins can modify
CREATE POLICY "Roles are viewable by authenticated users" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Organizations: Publicly viewable, only admins/owners can modify
CREATE POLICY "Organizations are viewable by everyone" ON public.organizations
  FOR SELECT USING (true);

CREATE POLICY "Organization owners can update" ON public.organizations
  FOR UPDATE USING (auth.uid() = owner_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert organizations" ON public.organizations
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organization'));

-- Clubs: Publicly viewable
CREATE POLICY "Clubs are viewable by everyone" ON public.clubs
  FOR SELECT USING (true);

CREATE POLICY "Organization members can manage clubs" ON public.clubs
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organization'));

-- Events: Published events are public, organizers can manage their own
CREATE POLICY "Published events are viewable by everyone" ON public.events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Organizers can manage events" ON public.events
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organization'));

-- Event registrations: Users can manage their own
CREATE POLICY "Users can view their registrations" ON public.event_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" ON public.event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their registration" ON public.event_registrations
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view all registrations" ON public.event_registrations
  FOR SELECT USING (public.has_role(auth.uid(), 'organization') OR public.has_role(auth.uid(), 'admin'));

-- Event attendance
CREATE POLICY "Users can view their attendance" ON public.event_attendance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark attendance" ON public.event_attendance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their attendance" ON public.event_attendance
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view all attendance" ON public.event_attendance
  FOR SELECT USING (public.has_role(auth.uid(), 'organization') OR public.has_role(auth.uid(), 'admin'));

-- OD List
CREATE POLICY "Users can view their OD entries" ON public.od_list
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Faculty can view all OD entries" ON public.od_list
  FOR SELECT USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can update OD status" ON public.od_list
  FOR UPDATE USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert OD entries" ON public.od_list
  FOR INSERT WITH CHECK (true);

-- Club memberships
CREATE POLICY "Users can view their memberships" ON public.club_memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join clubs" ON public.club_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave clubs" ON public.club_memberships
  FOR DELETE USING (auth.uid() = user_id);

-- Event bookmarks
CREATE POLICY "Users can view their bookmarks" ON public.event_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark events" ON public.event_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON public.event_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);
CREATE INDEX idx_event_attendance_event ON public.event_attendance(event_id);
CREATE INDEX idx_od_list_user ON public.od_list(user_id);
CREATE INDEX idx_od_list_status ON public.od_list(status);
CREATE INDEX idx_clubs_category ON public.clubs(category);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);