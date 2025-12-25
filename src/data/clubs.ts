// SRM Students Clubs Data extracted from the PDF
export interface ClubData {
  id: string;
  name: string;
  description: string;
  category: "technical" | "cultural" | "sports" | "social_service" | "literary" | "photography" | "esports" | "debate";
  coordinatorName: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  joinFormUrl?: string; // Optional - clubs will add their own Google Form links
}

export const srmClubs: ClubData[] = [
  {
    id: "1",
    name: "Hackhound",
    description: "SRM's premier coding and hackathon club. We organize coding competitions, workshops, and participate in national-level hackathons. Join us to level up your programming skills!",
    category: "technical",
    coordinatorName: "Dr. Oshin Sharma",
    coordinatorEmail: "oshins1@srmist.edu.in",
    coordinatorPhone: "7619187871",
    // Club will add their Google Form link here
  },
  {
    id: "2",
    name: "E-Sports Club",
    description: "Competitive gaming club for passionate gamers. We host tournaments for popular games, build teams for inter-college competitions, and create a community of gaming enthusiasts.",
    category: "esports",
    coordinatorName: "Himanshu",
    coordinatorEmail: "himanshs1@srmist.edu.in",
    coordinatorPhone: "9457372686",
  },
  {
    id: "3",
    name: "GeeksforGeeks SRM",
    description: "Official GeeksforGeeks student chapter at SRM NCR. We conduct coding bootcamps, DSA workshops, placement preparation sessions, and competitive programming contests.",
    category: "technical",
    coordinatorName: "Nidhi Pandey",
    coordinatorEmail: "nidhip@srmist.edu.in",
    coordinatorPhone: "8707072700",
  },
  {
    id: "4",
    name: "Kalamgiri Literary Club",
    description: "A haven for writers, poets, and literature enthusiasts. We organize poetry slams, creative writing workshops, open mic nights, and publish our own literary magazine.",
    category: "literary",
    coordinatorName: "Ms. Prerna Sharma",
    coordinatorEmail: "prernas@srmist.edu.in",
    coordinatorPhone: "9650410672",
  },
  {
    id: "5",
    name: "NSS - National Service Scheme",
    description: "Dedicated to community service and social welfare. We organize blood donation camps, environmental drives, village adoption programs, and various social awareness campaigns.",
    category: "social_service",
    coordinatorName: "Dr. Nirmal Sharma",
    coordinatorEmail: "nirmals@srmist.edu.in",
    coordinatorPhone: "8266080984",
  },
  {
    id: "6",
    name: "NCC - National Cadet Corps",
    description: "Building character and discipline through military training. NCC cadets participate in camps, adventure activities, and get opportunities to serve the nation.",
    category: "social_service",
    coordinatorName: "Dr. Sandeep Kumar",
    coordinatorEmail: "sandeepd@srmist.edu.in",
    coordinatorPhone: "9012355511",
  },
  {
    id: "7",
    name: "Rangeen Pixels - Photography Club",
    description: "Capture moments, tell stories. We conduct photography walks, workshops on editing, photo exhibitions, and help members build impressive portfolios.",
    category: "photography",
    coordinatorName: "Anjali Malik",
    coordinatorEmail: "anjalim1@srmist.edu.in",
    coordinatorPhone: "8265958001",
  },
  {
    id: "8",
    name: "ISTE - Indian Society for Technical Education",
    description: "Promoting quality technical education and industry connections. We organize technical seminars, industrial visits, and skill development programs.",
    category: "technical",
    coordinatorName: "Dr. Swati Bhatt",
    coordinatorEmail: "swatib@srmist.edu.in",
    coordinatorPhone: "9910874774",
  },
  {
    id: "9",
    name: "SRMNMUN - Model United Nations",
    description: "Debate, diplomacy, and global affairs. Participate in MUN conferences, develop public speaking skills, and understand international relations through simulated UN sessions.",
    category: "debate",
    coordinatorName: "Dr. Niranjan Lal",
    coordinatorEmail: "niranjal@srmist.edu.in",
    coordinatorPhone: "9993110445",
  },
  {
    id: "10",
    name: "Cultural Committee",
    description: "The heart of campus celebrations! We organize annual fests, cultural nights, dance competitions, music events, and bring the campus alive with creativity.",
    category: "cultural",
    coordinatorName: "Dr. Megha Gupta Chaudhary",
    coordinatorEmail: "meghagua@srmist.edu.in",
    coordinatorPhone: "9411176543",
  },
  {
    id: "11",
    name: "Robotics Club",
    description: "Build, program, and innovate with robotics. We work on exciting projects from line followers to autonomous drones, and compete in national robotics competitions.",
    category: "technical",
    coordinatorName: "Ms. Harshita Tyagi",
    coordinatorEmail: "harshitatyagi@srmist.edu.in",
    coordinatorPhone: "8791438997",
  },
  {
    id: "12",
    name: "Entrepreneurship Cell",
    description: "Nurturing the next generation of entrepreneurs. We host startup pitches, business plan competitions, mentorship programs, and connect students with investors.",
    category: "technical",
    coordinatorName: "Dr. Oshin Sharma",
    coordinatorEmail: "oshins1@srmist.edu.in",
    coordinatorPhone: "7619187871",
  },
  {
    id: "13",
    name: "SAE India - Automotive Club",
    description: "For automobile and mechanical engineering enthusiasts. We design and build vehicles for BAJA, SUPRA, and other SAE competitions.",
    category: "technical",
    coordinatorName: "Dr. Gyanendra P Bagri",
    coordinatorEmail: "hod.mech.ncr@srmist.edu.in",
    coordinatorPhone: "9456905782",
  },
  {
    id: "14",
    name: "Wellness & Yoga Club",
    description: "Mental and physical wellness for students. We conduct yoga sessions, meditation workshops, stress management programs, and promote a healthy campus lifestyle.",
    category: "sports",
    coordinatorName: "Dr. Garima Pandey",
    coordinatorEmail: "garimap@srmist.edu.in",
    coordinatorPhone: "9897297255",
  },
  {
    id: "15",
    name: "IEEE Student Branch",
    description: "World's largest technical professional organization. We organize workshops, hackathons, technical paper presentations, and provide networking opportunities.",
    category: "technical",
    coordinatorName: "Dr. Pallavi Jain",
    coordinatorEmail: "pallavij@srmist.edu.in",
    coordinatorPhone: "9219703700",
  },
  {
    id: "16",
    name: "AI/ML Club",
    description: "Exploring the frontiers of Artificial Intelligence and Machine Learning. We work on real-world AI projects, conduct workshops, and participate in Kaggle competitions.",
    category: "technical",
    coordinatorName: "Dr. M. Vinoth Kumar",
    coordinatorEmail: "vinothkm@srmist.edu.in",
    coordinatorPhone: "8272818152",
  },
];

export const clubCategories = [
  { value: "all", label: "All Clubs" },
  { value: "technical", label: "Technical" },
  { value: "cultural", label: "Cultural" },
  { value: "sports", label: "Sports" },
  { value: "social_service", label: "Social Service" },
  { value: "literary", label: "Literary" },
  { value: "photography", label: "Photography" },
  { value: "esports", label: "E-Sports" },
  { value: "debate", label: "Debate" },
];
