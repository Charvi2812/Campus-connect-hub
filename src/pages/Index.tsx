import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { 
  Calendar, 
  Users, 
  QrCode, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Discover Events",
    description: "Browse hackathons, workshops, and campus events all in one place."
  },
  {
    icon: QrCode,
    title: "QR Attendance",
    description: "Scan QR codes for automatic attendance and OD generation."
  },
  {
    icon: Users,
    title: "Join Clubs",
    description: "Explore and join student clubs that match your interests."
  },
  {
    icon: Shield,
    title: "OD Management",
    description: "Automatic OD generation with faculty approval workflow."
  },
];

const stats = [
  { value: "16+", label: "Active Clubs" },
  { value: "100+", label: "Events/Year" },
  { value: "5000+", label: "Students" },
  { value: "50+", label: "Hackathons" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-campus-purple/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-campus-purple/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-campus-coral/20 blur-2xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">SRM NCR Campus Platform</span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
              Your Campus,{" "}
              <span className="text-gradient">Connected</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Discover events, join clubs, track attendance, and never miss out on what's happening at SRM. All in one powerful platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/events">
                  Explore Events <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/clubs">
                  Browse Clubs
                </Link>
              </Button>
            </div>

            {/* Quick Features */}
            <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {["Real-time Updates", "QR Attendance", "Auto OD Generation", "Club Management"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg">
              A complete platform designed specifically for SRM students to stay connected with campus life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">How it Works</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple & Seamless
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in minutes and never miss a campus event again.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Sign Up", description: "Create your account with your SRM email in seconds.", icon: Zap },
              { step: "02", title: "Explore", description: "Browse events, hackathons, and clubs that interest you.", icon: Calendar },
              { step: "03", title: "Attend", description: "Register, scan QR for attendance, and get automatic OD.", icon: Clock },
            ].map((item, index) => (
              <div 
                key={item.step}
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-campus-purple text-primary-foreground font-display font-bold text-xl mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
                
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-br from-primary via-campus-purple to-campus-rose p-12 md:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-hero-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Connected?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of SRM students who are already discovering events and building their network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="glass" size="xl" asChild>
                  <Link to="/auth?mode=signup">
                    Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </Button>
                <Button variant="ghost" size="xl" className="text-white hover:bg-white/10" asChild>
                  <Link to="/clubs">
                    Explore Clubs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
