import { Link } from "react-router-dom";
import { Calendar, Users, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-campus-purple flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-display font-bold text-lg">C</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                CampusConnect
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              Your centralized platform for discovering events, hackathons, and club activities. 
              Connect with your campus community like never before.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>SRM Institute of Science and Technology, NCR Campus</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Explore Clubs
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  My Registrations
                </Link>
              </li>
              <li>
                <Link to="/scan" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Scan QR Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:support@campusconnect.edu" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  support@campusconnect.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CampusConnect. Built for SRM students.
          </p>
        </div>
      </div>
    </footer>
  );
}
