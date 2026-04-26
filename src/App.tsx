import { AnimatePresence, motion } from "motion/react";
import { 
  Send, 
  Leaf, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Info, 
  X, 
  MessageCircle,
  Stethoscope,
  BookOpen,
  Calendar,
  Mic,
  MapPin,
  Flame,
  Droplets,
  Wind,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  CheckCircle2,
  Heart,
  Phone,
  Map,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { chatWithWellnessAI } from "./services/geminiService";
import { YOGA_POSES, type YogaPose } from "./constants/yogaData";
import { ContactForm } from "./components/ContactForm";
import { CONTACT_DATA } from "./constants/contactData";
import { cn } from "./lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

interface Doctor {
  name: string;
  dept?: string;
  opd: string;
  time?: string;
  breakTime?: string;
  status: "Available" | "On Leave";
}

function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-stone-900 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-p-green flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Leaf className="w-64 h-64 -rotate-12 translate-x-20" />
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-bold serif">
            {doctor.name.charAt( doctor.name.startsWith("Dr.") ? 3 : 0)}
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2",
              doctor.status === "Available" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full", doctor.status === "Available" ? "bg-green-500" : "bg-red-500")} />
              {doctor.status}
            </div>
            <h3 className="serif text-2xl font-bold text-stone-900 dark:text-white capitalize">{doctor.name}</h3>
            <p className="text-sm text-stone-500 font-medium">{doctor.dept || "Specialist"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">OPD Cabinet</p>
              <p className="text-xl font-bold text-p-saffron serif">{doctor.opd}</p>
            </div>
            <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Shift</p>
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">{doctor.time || "Regular"}</p>
            </div>
          </div>

          {doctor.breakTime && (
            <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest">Lunch Break</p>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{doctor.breakTime}</p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <p className="text-[9px] text-stone-400 text-center mb-2 font-medium">Verify live status on the official portal:</p>
            <a 
              href="https://patanjaliwellness.com/doctorList.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2 bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-p-green rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              Doctor List
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <a 
            href="https://patanjaliwellness.com/contact.php" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-14 bg-p-green text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-p-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Consultation
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

const SUGGESTIONS = [
  { id: 1, label: "हिंदी में बात करें", query: "मैं हिंदी में बात करना चाहता हूँ।" },
  { id: 2, label: "Continue in English", query: "I want to continue in English." },
  { id: 3, label: "Yoga Pose Guide", query: "Can you show me some yoga poses and their benefits?" },
  { id: 4, label: "Doctors on Leave", query: "Which doctors are currently on leave?" },
];

function YogaCard({ pose }: { pose: YogaPose }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-4 w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pose.image} 
          alt={pose.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-p-saffron to-p-yellow text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
          {pose.hindiName}
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 p-3 rounded-2xl bg-white dark:bg-stone-800 shadow-xl border border-stone-100 dark:border-stone-700">
           <Leaf className="w-5 h-5 text-p-green" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="serif text-xl font-bold text-p-green dark:text-p-sage">{pose.name}</h3>
            <p className="text-xs text-stone-500 font-medium">{pose.description}</p>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-p-blue/10 hover:bg-p-blue text-p-blue hover:text-white transition-all shadow-sm"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-p-yellow" />
              Healing Benefits
            </h4>
            <div className="flex flex-wrap gap-2">
              {pose.benefits.map((benefit, i) => (
                <span key={i} className="px-2 py-1 bg-gradient-to-r from-p-green/10 to-p-blue/10 text-p-green dark:text-p-sage text-[10px] font-bold rounded-lg border border-p-green/20">
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-p-green" />
                    Instructions
                  </h4>
                  <div className="space-y-3">
                    {pose.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 shrink-0 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] flex items-center justify-center font-bold text-stone-500">
                          {i + 1}
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function SidebarContent({ lastUpdated, doctorStats, doctorsList, onLeaveList, setSelectedDoctor }: { 
  lastUpdated: string | null, 
  doctorStats: { available: number, onLeave: number } | null,
  doctorsList: Doctor[],
  onLeaveList: Doctor[],
  setSelectedDoctor: (d: Doctor) => void
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-1 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn("w-2 h-2 rounded-full", lastUpdated ? "bg-green-500 animate-pulse" : "bg-stone-300 dark:bg-stone-700")} />
          <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
            {lastUpdated ? `Live Sync: ${lastUpdated}` : "Connecting..."}
          </span>
        </div>
        {doctorStats && (
          <div className="flex gap-3 text-[9px] font-bold uppercase tracking-tight">
            <span className="text-green-600/70 dark:text-green-500/70">{doctorStats.available} Available</span>
            <span className="text-stone-400/70 dark:text-stone-500/70">{doctorStats.onLeave} On Leave</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 -mr-1 scrollbar-hide pb-20 lg:pb-0">
        {/* Available Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="serif text-[10px] font-bold text-p-stone dark:text-p-sage uppercase tracking-wider">Available Doctors</h3>
            <a 
              href="https://patanjaliwellness.com/doctorList.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-p-green hover:underline flex items-center gap-1"
            >
              Full List
              <ChevronRight className="w-2 h-2" />
            </a>
          </div>
          
          <div className="space-y-2 lg:space-y-3">
            {doctorsList.slice(0, 10).map((doc, i) => (
                <div 
                key={i} 
                onClick={() => setSelectedDoctor(doc)}
                className="group p-4 rounded-2xl bg-white dark:bg-stone-800/40 border-2 border-transparent hover:border-p-green hover:shadow-2xl hover:shadow-p-green/10 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-p-green/5 rounded-full -mr-6 -mt-6 group-hover:bg-p-green/10 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-p-green to-emerald-600 text-white flex items-center justify-center text-[12px] font-black shadow-lg shadow-p-green/20">
                      {doc.name.charAt(doc.name.startsWith("Dr.") ? 3 : 0)}
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-stone-800 dark:text-stone-100 truncate w-28 group-hover:text-p-green transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-0.5">OPD: {doc.opd}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-p-green group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-[9px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest">Available Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Section */}
        {onLeaveList.length > 0 && (
          <div className="space-y-2">
            <div className="px-1">
              <h3 className="serif text-[10px] font-bold text-stone-400 uppercase tracking-wider">On Leave Today</h3>
            </div>
            <div className="space-y-2">
              {onLeaveList.slice(0, 5).map((doc, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedDoctor(doc)}
                  className="group p-3 rounded-2xl bg-stone-100/50 dark:bg-stone-900/30 border border-stone-200/50 dark:border-stone-800/50 hover:border-red-200 dark:hover:border-red-900/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-400 flex items-center justify-center text-[10px] font-bold">
                        {doc.name.charAt(doc.name.startsWith("Dr.") ? 3 : 0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-stone-50 dark:text-stone-400 truncate w-24">
                          {doc.name}
                        </p>
                        <p className="text-[9px] font-medium text-stone-400">OPD: {doc.opd}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      <span className="text-[8px] font-bold text-red-500/70 uppercase tracking-tighter">Leave</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-3xl bg-accent-soft border border-vibrant-border">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3 h-3 text-p-stone dark:text-p-sage" />
            <h3 className="serif text-[10px] font-bold text-p-stone dark:text-p-sage uppercase tracking-wider">Support</h3>
          </div>
          <p className="text-[10px] leading-relaxed text-stone-600 dark:text-stone-400 font-medium whitespace-pre-line">
            Helpline: <a href="tel:+918954666111" className="hover:text-p-green hover:underline tracking-wider">+91-8954666111</a>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-accent-soft border border-vibrant-border">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-p-stone dark:text-p-sage" />
            <h3 className="serif text-[10px] font-bold text-p-stone dark:text-p-sage uppercase tracking-wider">Site Map</h3>
          </div>
          <a 
            href="https://patanjaliwellness.com/sitemap.php" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-p-green hover:underline uppercase tracking-wider"
          >
            Campus Explorer
            <ChevronRight className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      <div className="mt-auto p-4 bg-stone-800 dark:bg-stone-900 rounded-2xl text-white shadow-xl">
        <p className="text-[8px] font-bold tracking-widest uppercase opacity-50 mb-1">Harmony Focus</p>
        <p className="text-[10px] italic leading-tight">"Health is spiritual harmony."</p>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "🙏 Om Namaste! Welcome to Patanjali Wellness . \n\nBefore we begin, would you like to continue in **English** or **Hindi**? \n\nनमस्ते! पतंजलि वैलनेस  में आपका स्वागत है। \nआगे बढ़ने से पहले, क्या आप **हिंदी** या **अंग्रेजी** में बात करना चाहेंगे?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [liveDoctorContext, setLiveDoctorContext] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [doctorStats, setDoctorStats] = useState<{ available: number, onLeave: number } | null>(null);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [onLeaveList, setOnLeaveList] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dark Mode side effect & System preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Function to update based on system preference if no manual override exists
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const hasManualOverride = localStorage.getItem("theme");
      if (!hasManualOverride) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [isDarkMode]);

  // Fetch Live Doctors on Mount
  useEffect(() => {
    const fetchLiveDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (data.doctors && data.onLeave) {
          setDoctorsList(data.doctors);
          setOnLeaveList(data.onLeave);
          const availableStr = data.doctors.map((d: any) => 
            `- ${d.name} (${d.dept}) [OPD ${d.opd}] Timing: ${d.time}${d.breakTime ? `, Break: ${d.breakTime}` : ""}`
          ).join("\n");
          const leaveStr = data.onLeave.map((d: any) => 
            `- ${d.name} ${d.dept ? `(${d.dept}) ` : ""}[OPD ${d.opd}] (Currently on Leave)`
          ).join("\n");
          setLiveDoctorContext(`AVAILABLE DOCTORS:\n${availableStr}\n\nDOCTORS ON LEAVE:\n${leaveStr}`);
          setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
          setDoctorStats({ available: data.doctors.length, onLeave: data.onLeave.length });
        }
      } catch (err) {
        console.error("Failed to fetch live doctor data", err);
      }
    };
    fetchLiveDoctors();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const responseText = await chatWithWellnessAI(text, history, liveDoctorContext || undefined);
      
      const botMessage: Message = {
        role: "model",
        text: responseText || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "model",
        text: "❌ Namaste, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-p-cream transition-colors duration-300">
      {/* Mobile Drawer (Sliding Menu) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col gap-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-p-saffron rounded-full flex items-center justify-center text-white font-bold serif text-lg shadow-md">
                    P
                  </div>
                  <span className="font-semibold text-base tracking-tight serif dark:text-stone-100 uppercase">Patanjali Wellness</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SidebarContent 
                lastUpdated={lastUpdated} 
                doctorStats={doctorStats} 
                doctorsList={doctorsList} 
                onLeaveList={onLeaveList} 
                setSelectedDoctor={setSelectedDoctor} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar: Wellness Context (Desktop) */}
      <aside className="hidden lg:flex w-80 h-full border-r border-stone-200 dark:border-stone-800 p-6 flex-col gap-6 bg-white dark:bg-stone-900 overflow-hidden relative group">
        {/* Animated decorative backgrounds */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-p-saffron/10 rounded-full blur-3xl group-hover:bg-p-saffron/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-p-blue/10 rounded-full blur-3xl group-hover:bg-p-blue/20 transition-all duration-1000"></div>
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-p-saffron via-p-yellow via-p-green to-p-blue"></div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-p-saffron via-p-orange-bright to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold serif text-3xl shadow-xl shadow-p-saffron/30 rotate-3 transition-all hover:rotate-0 hover:scale-105">
            P
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight serif dark:text-stone-100 leading-none bg-gradient-to-r from-stone-800 to-stone-500 dark:from-white dark:to-stone-400 bg-clip-text text-transparent">Patanjali</h1>
            <p className="text-[10px] font-black text-p-green dark:text-p-sage uppercase tracking-[0.25em] mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-p-green animate-pulse"></span>
              Wellness Centre
            </p>
          </div>
        </div>
        <SidebarContent 
          lastUpdated={lastUpdated} 
          doctorStats={doctorStats} 
          doctorsList={doctorsList} 
          onLeaveList={onLeaveList} 
          setSelectedDoctor={setSelectedDoctor} 
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full bg-p-cream dark:bg-stone-950 transition-colors duration-500 overflow-hidden">
        {/* Header Navigation */}
        <header className="h-16 lg:h-20 border-b border-stone-200 dark:border-stone-800 px-4 lg:px-8 flex items-center justify-between bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl relative z-20 transition-colors duration-300 shadow-sm shadow-stone-200/50">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-p-blue via-p-emerald via-p-green via-p-yellow to-p-saffron"></div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-2xl hover:bg-p-blue/10 hover:text-p-blue transition-all border border-stone-200/50 dark:border-stone-700/50"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-p-green shadow-[0_0_15px_rgba(45,106,79,0.7)] animate-pulse"></div>
                  <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-p-green animate-ping opacity-20"></div>
                </div>
                <h2 className="serif text-base lg:text-2xl font-black bg-gradient-to-r from-p-green via-p-deep-blue to-p-blue bg-clip-text text-transparent tracking-tight">Wellness AI Assistant</h2>
              </div>
              <p className="hidden xs:block text-[9px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] leading-none mt-1.5">Official Global Digital Seva</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-p-yellow/20 hover:text-p-saffron transition-all text-stone-600 dark:text-stone-300"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <a 
              href={`tel:${CONTACT_DATA.mainHelpline.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-2 px-3 lg:px-6 py-2.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-p-saffron to-orange-600 text-white rounded-full hover:shadow-xl hover:shadow-p-saffron/30 transition-all active:scale-95"
            >
              <Phone className="w-3 h-3 fill-white" />
              <span className="hidden sm:inline">24/7 Helpline</span>
              <span className="sm:hidden">Call</span>
            </a>
            
            <button 
              onClick={() => setIsContactFormOpen(true)}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-stone-800 text-p-blue border-2 border-p-blue/20 rounded-full hover:bg-p-blue hover:text-white transition-all shadow-lg shadow-p-blue/5"
            >
              <Calendar className="w-3 h-3" />
              Book Treatment
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-8 scrollbar-hide pb-24 lg:pb-10">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-4 max-w-[85%]",
                  message.role === "user" ? "self-end flex-row-reverse" : "self-start"
                )}
              >
                <div className={cn(
                  "w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-xl shadow-2xl transition-all duration-500",
                  message.role === "user" ? "bg-gradient-to-br from-p-blue via-p-deep-blue to-p-blue/70 text-white rotate-3 hover:rotate-0" : "bg-gradient-to-br from-white via-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border border-stone-200 dark:border-stone-700 -rotate-3 hover:rotate-0"
                )}>
                  {message.role === "user" ? "AS" : (index === 0 ? "🔱" : "🌿")}
                </div>
                <div className="space-y-2 max-w-[85%] lg:max-w-[75%]">
                  <div className={cn(
                    "p-5 px-6 text-[13px] lg:text-[14px] leading-relaxed shadow-xl relative overflow-hidden",
                    message.role === "user" 
                      ? "bubble-user bg-gradient-to-r from-p-blue to-p-deep-blue text-white font-medium" 
                      : "bubble-bot bg-white dark:bg-stone-900 border-l-4 border-l-p-saffron dark:text-stone-200"
                  )}>
                    {message.role === "model" && index > 0 && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-p-saffron/5 rounded-full -mr-8 -mt-8"></div>
                    )}
                    <div className="markdown-body">
                      <ReactMarkdown>
                        {message.text.replace(/\[YOGA:([a-z-]+)\]/g, "")}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {/* Parse and render Yoga Card if present */}
                  {message.role === "model" && message.text.match(/\[YOGA:([a-z-]+)\]/) && (
                    <div className="flex flex-col gap-4">
                      {Array.from(message.text.matchAll(/\[YOGA:([a-z-]+)\]/g)).map((match, i) => {
                        const poseId = match[1];
                        const pose = YOGA_POSES[poseId];
                        return pose ? <YogaCard key={i} pose={pose} /> : null;
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 max-w-[80%]">
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 shrink-0 flex items-center justify-center text-lg border border-stone-200 dark:border-stone-700 font-sans">
                  <div className="animate-spin text-xs">🌿</div>
                </div>
                <div className="bubble-bot p-4 px-6 flex gap-2">
                  <div className="w-1.5 h-1.5 bg-p-sage rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-p-sage rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-p-sage rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="w-full p-8 pt-0 bg-gradient-to-t from-p-cream via-p-cream to-transparent relative z-10 transition-colors duration-300">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask about Chyawanprash, Yoga poses, or Skin care..." 
                className="w-full h-16 pl-6 pr-44 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-p-green/30 text-sm font-medium transition-all dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600"
              />
              <div className="absolute right-2 top-2 h-12 flex gap-2">
                <button className="h-12 w-12 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-100 dark:border-stone-700 transition-colors group">
                  <Mic className="w-5 h-5 text-stone-400 dark:text-stone-50 group-hover:text-p-saffron transition-colors" />
                </button>
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="h-12 px-8 rounded-full bg-gradient-to-r from-p-green to-p-blue text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-p-blue/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Send
                </button>
              </div>
            </div>
            
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-3 px-4 overflow-hidden">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.query)}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest cursor-pointer px-4 py-2 rounded-xl border transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md animate-in fade-in slide-in-from-bottom-2",
                    idx === 0 ? "bg-p-saffron/10 text-p-saffron border-p-saffron/20 hover:bg-p-saffron hover:text-white" :
                    idx === 1 ? "bg-p-green/10 text-p-green border-p-green/20 hover:bg-p-green hover:text-white" :
                    idx === 2 ? "bg-p-blue/10 text-p-blue border-p-blue/20 hover:bg-p-blue hover:text-white" :
                    "bg-p-yellow/10 text-stone-600 border-p-yellow/30 hover:bg-p-yellow hover:text-stone-900"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/95 dark:bg-stone-900/95 backdrop-blur-3xl border-2 border-white/20 dark:border-stone-800/50 flex items-center justify-around px-4 z-40 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <button 
            onClick={() => setMessages([{
              role: "model",
              text: "🙏 Om Namaste! I am your Patanjali Wellness AI. How may I assist you with Yoga or Ayurveda today?",
              timestamp: new Date(),
            }])}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-p-saffron transition-all active:scale-90"
          >
            <div className="p-1 px-2 mb-0.5 rounded-lg hover:bg-p-saffron/10 transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Reset</span>
          </button>
          
          <button 
            onClick={() => setIsContactFormOpen(true)}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-p-blue transition-all active:scale-90"
          >
            <div className="p-1 px-2 mb-0.5 rounded-lg hover:bg-p-blue/10 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Portal</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 p-4 -mt-14 bg-gradient-to-tr from-p-saffron via-p-orange-bright to-p-yellow text-white rounded-[24px] shadow-2xl shadow-p-saffron/40 border-[5px] border-p-cream dark:border-stone-950 transform active:scale-90 transition-all group relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-[19px] scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            <Stethoscope className="w-7 h-7 relative z-10" />
          </button>

          <a 
            href={`https://wa.me/${CONTACT_DATA.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-p-green transition-all active:scale-90"
          >
            <div className="p-1 px-2 mb-0.5 rounded-lg hover:bg-p-green/10 transition-colors">
              <MessageCircle className="w-5 h-5 text-p-green" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Chat</span>
          </a>

          <a 
            href="https://patanjaliwellness.com/sitemap.php"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-p-blue transition-all active:scale-90"
          >
            <div className="p-1 px-2 mb-0.5 rounded-lg hover:bg-p-blue/10 transition-colors">
              <Map className="w-5 h-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Map</span>
          </a>
        </div>
      </main>

      {/* Background Motifs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-p-yellow/5 rounded-full blur-[120px] transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-p-blue/5 rounded-full blur-[120px] transition-opacity"></div>
        <img 
          src="https://patanjaliwellness.com/assets/images/Home-Banner/desktop-web-b/Haridwar-webbanner.webp"
          alt="Haridwar Background"
          className="w-full h-full object-cover opacity-[0.06] dark:opacity-[0.03] transition-opacity duration-1000 grayscale hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-p-cream/40 via-transparent to-p-cream/40 dark:from-stone-950 dark:to-stone-950" />
      </div>

      <div className="fixed top-20 right-0 -z-0 opacity-[0.04] dark:opacity-[0.01] pointer-events-none rotate-12 transition-opacity">
        <Leaf className="w-[600px] h-[600px] text-p-green" />
      </div>
      
      <div className="fixed bottom-20 left-0 -z-0 opacity-[0.03] dark:opacity-[0.01] pointer-events-none -rotate-12 transition-opacity">
        <Leaf className="w-[400px] h-[400px] text-p-saffron" />
      </div>

      <AnimatePresence>
        {isContactFormOpen && (
          <ContactForm onClose={() => setIsContactFormOpen(false)} />
        )}
        {selectedDoctor && (
          <DoctorModal 
            doctor={selectedDoctor} 
            onClose={() => setSelectedDoctor(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
