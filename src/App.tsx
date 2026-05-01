import { AnimatePresence, motion } from "motion/react";
import { 
  Trash2,
  Send, 
  Leaf, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Info, 
  X, 
  MessageCircle,
  Phone,
  Map,
  MapPin,
  Volume2,
  VolumeX,
  Mic,
  Calendar,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Sun,
  Moon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { chatWithWellnessAI } from "./services/geminiService";
import { YOGA_POSES, type YogaPose } from "./constants/yogaData";
import { ContactForm } from "./components/ContactForm";
import { CONTACT_DATA } from "./constants/contactData";
import { cn } from "./lib/utils";
import { useTTS } from "./hooks/useTTS";
import { useSpeechToText } from "./hooks/useSpeechToText";
import { TreatmentDirectory } from "./components/TreatmentDirectory";
import { Activity } from "lucide-react";

const PATANJALI_LOGO = "https://patanjaliwellness.com/assets/images/Patanjali-Wellness-logo.png";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { id: 1, label: "Booking Process", query: "What is the process to book a stay at Patanjali Wellness?" },
  { id: 2, label: "Panchkarma", query: "What are the benefits of Panchkarma therapy?" },
  { id: 3, label: "Treatment Fee", query: "What is the cost or fee structure for treatments?" },
  { id: 4, label: "Yoga Sessions", query: "Tell me about the daily yoga schedule." },
];

function YogaCard({ pose }: { pose: YogaPose }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      className="mt-4 w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pose.image} 
          alt={pose.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
          {pose.hindiName}
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 p-3 rounded-2xl bg-white dark:bg-stone-800 shadow-xl border border-stone-100 dark:border-stone-700">
           <Leaf className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="serif text-xl font-bold text-green-800 dark:text-green-400">{pose.name}</h3>
            <p className="text-xs text-stone-500 font-medium mt-1">{pose.description}</p>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all shadow-sm"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              Healing Benefits
            </h4>
            <div className="flex flex-wrap gap-2">
              {pose.benefits.map((benefit, i) => (
                <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-lg border border-green-100 dark:border-green-800">
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
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
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

function BookingGuide() {
  const steps = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />,
      text: "Register yourself, generate MR Number (www.hms.patanjaliwellness.com)"
    },
    {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      text: "If already registered, login with your credentials (Login Id & Password)"
    },
    {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      text: "Generate IPD/OPD booking request"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      text: "Once request is approved from our BAMS & BNYS Doctors, then book your room."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <div 
        style={{ backgroundColor: "#e4f7f5", color: "#000000" }}
        className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-3 h-3 text-orange-600" />
          <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Booking Process</h3>
        </div>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start group">
              <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                {step.icon}
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400 font-medium">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1">
        <div className="text-center">
          <a 
            href="https://hms.patanjaliwellness.com/#/auth/registration" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Sign Up
          </a>
          <p className="text-[8px] text-stone-400 mt-1 uppercase font-bold">For new user</p>
        </div>
        <div className="text-center">
          <a 
            href="https://hms.patanjaliwellness.com/#/auth/login" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-stone-200 dark:border-stone-700 shadow-sm active:scale-95"
          >
            Login
          </a>
          <p className="text-[8px] text-stone-400 mt-1 uppercase font-bold">Existing user</p>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-3 h-3 text-indigo-600" />
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Booking Query</p>
        </div>
        <a href="tel:8954666111" className="text-sm font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
          8954666111
        </a>
      </div>

      <div className="px-1">
        <a 
          href="https://patanjaliwellness.com/wellness-center.php" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ backgroundColor: "#e7feff" }}
          className="flex items-center justify-between group p-3 rounded-2xl border border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all text-xs"
        >
          <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400">Nearest Wellness Center</span>
          <Map className="w-4 h-4 text-stone-400 group-hover:text-indigo-600 transition-colors" />
        </a>
      </div>
    </motion.div>
  );
}

function SidebarContent() {
  const treatments = [
    "Yog Therapy", "Ayurved", "Naturopathy", "Panchkarma", 
    "Diet Therapy", "Acupressure", "Acupuncture", 
    "Physiotherapy", "Ozone Therapy"
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 -mr-1 scrollbar-hide pb-20 lg:pb-0">
        <BookingGuide />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="p-4 rounded-3xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-3 h-3 text-green-600" />
            <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Our Treatments</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {treatments.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ backgroundColor: "#e1e9ff" }}
          className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-3 h-3 text-indigo-600" />
            <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Support Helpline</h3>
          </div>
          <div className="space-y-3">
            <a 
              href={`tel:${CONTACT_DATA.mainHelpline.replace(/\D/g, '')}`} 
              className="flex items-center justify-between p-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-indigo-500 transition-all group"
            >
              <div>
                <p className="text-[10px] font-bold text-stone-900 dark:text-stone-100">{CONTACT_DATA.mainHelpline}</p>
                <p className="text-[8px] text-stone-400 uppercase tracking-wider">Tap to call</p>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Phone className="w-3 h-3" />
              </div>
            </a>
            
            {CONTACT_DATA.helpline[0].phones.filter(p => p !== CONTACT_DATA.mainHelpline).map((phone, idx) => (
              <a 
                key={idx}
                href={`tel:${phone.replace(/\D/g, '')}`} 
                className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline px-1"
              >
                Alt: {phone}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ backgroundColor: "#fffb99" }}
          className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50"
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-stone-500" />
            <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Haridwar HQ</h3>
          </div>
          <a 
            href="https://maps.app.goo.gl/tjSrrsUrQ3VbpKUa6"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[10px] leading-relaxed text-stone-600 dark:text-stone-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {CONTACT_DATA.address}
            <span className="block text-[8px] text-stone-400 uppercase tracking-wider mt-1">Tap to view on Map</span>
          </a>
        </motion.div>
      </div>

      <div className="mt-auto p-4 bg-stone-800 dark:bg-stone-900 rounded-2xl text-white shadow-xl">
        <p className="text-[8px] font-bold tracking-widest uppercase opacity-50 mb-1">Root Cause Healing</p>
        <p className="text-[10px] italic leading-tight">"Disease-free lifestyle is the ultimate medicine."</p>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "🙏 **Namaste**! Welcome to **Patanjali Wellness **. \n\nI can help you with wellness center locations, registration requirements, ayurvedic treatments, and yoga practices. \n\nWould you like to continue in **English** or **Hindi**?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isTreatmentsOpen, setIsTreatmentsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { voices, selectedVoiceIndex, setSelectedVoiceIndex, speak, stop, isSpeaking } = useTTS();
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | null>(null);
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + (prev ? " " : "") + transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

      const responseText = await chatWithWellnessAI(text, history);
      
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

  const handleClearChat = () => {
    setMessages([
      {
        role: "model",
        text: "🙏 **Namaste**! Welcome to **Patanjali Wellness **. \n\nI can help you with wellness center locations, registration requirements, ayurvedic treatments, and yoga practices. \n\nWould you like to continue in **English** or **Hindi**?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    clearTranscript();
    stop();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-stone-50 dark:bg-stone-950 transition-colors duration-300 relative">
      {/* Mobile Drawer */}
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center h-12 w-full">
                  <img 
                    src={PATANJALI_LOGO} 
                    alt="Patanjali Wellness" 
                    className="h-full w-full object-contain brightness-110 select-none"
                  />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-orange-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 shadow-xl flex items-center gap-3 font-bold group hover:border-orange-500 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-sm border border-stone-100">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEw7fyPYix-Xx48amEse6GGw8pdA2nhSw7g&s" 
                      alt="Patanjali" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-stone-700 dark:text-stone-200">Wellness Chat</span>
                </div>


              </div>

            <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside 
        style={{ backgroundColor: "#f8fff9" }}
        className="hidden lg:flex w-80 h-full border-r border-stone-200 dark:border-stone-800 p-6 flex-col gap-6 bg-white dark:bg-stone-900 overflow-hidden"
      >
        <div className="flex items-center h-16 w-full mb-6">
          <img 
            src={PATANJALI_LOGO} 
            alt="Patanjali Wellness" 
            className="h-full w-full object-contain brightness-110 select-none"
          />
        </div>

        <div className="space-y-2">
          <div 
            style={{ backgroundColor: "#c2e481", borderStyle: "dashed" }}
            className="w-full p-3 rounded-2xl flex items-center gap-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 shadow-sm font-bold group hover:border-orange-500 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-sm border border-stone-100">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEw7fyPYix-Xx48amEse6GGw8pdA2nhSw7g&s" 
                alt="Patanjali" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-stone-700 dark:text-stone-200">Wellness AI Assistant</span>
          </div>
        </div>

        <SidebarContent />
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-16 lg:h-20 border-b border-white/30 px-4 lg:px-8 flex items-center justify-between relative overflow-hidden group shadow-sm">
          {/* 4K Vibrant Light Yellow & Orange Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-orange-400 to-yellow-200 opacity-95 dark:opacity-90 z-0" />
          <div 
            style={{ backgroundColor: "#f3fbef", borderColor: "#292424" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent z-0" 
          />
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-orange-950 bg-white/40 hover:bg-white/60 rounded-xl transition-all flex items-center justify-center w-12 h-12 overflow-hidden shadow-sm aspect-square"
            >
              <img src={PATANJALI_LOGO} alt="logo" className="w-full h-full object-contain scale-110" />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none h-full py-1">
            <img 
              src={PATANJALI_LOGO} 
              alt="Patanjali Wellness Logo" 
              className="h-full w-auto object-contain drop-shadow-2xl brightness-110 contrast-110 select-none"
            />
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={handleClearChat}
              title="Clear Everything"
              style={{ backgroundColor: "#de595c" }}
              className="p-2.5 bg-red-500 hover:bg-red-600 rounded-full text-white hover:scale-110 transition-all shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ backgroundColor: "#b0bfe6" }}
              className="p-2.5 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full text-blue-900"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setIsContactFormOpen(true)}
              style={{ backgroundColor: "#4e925b" }}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-orange-600 text-white rounded-full hover:bg-orange-700 hover:shadow-orange-200 shadow-lg hover:scale-105 transition-all outline outline-2 outline-white/20"
            >
              <Calendar className="w-3 h-3" />
              Book Treatment
            </button>
          </div>
        </header>
        
        {/* Scrolling Announcement */}
        <div 
          style={{ backgroundColor: "#fdf8ff", color: "#0ad3f8" }}
          className="bg-indigo-600 dark:bg-indigo-900 text-white py-2 overflow-hidden whitespace-nowrap relative z-10 shadow-sm"
        >
          <motion.div
            animate={{ x: ["10%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="inline-block"
          >
            <a 
              href="https://whatsapp.com/channel/0029VbCrqZVJpe8jL7YLBP00" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 font-bold text-[11px] md:text-sm tracking-wide hover:underline decoration-white/50"
            >
              <span style={{ backgroundColor: "#f8f4f4", color: "#9a4545", borderStyle: "none" }}>॥ॐ॥ पतंजलि वेलनेस के आधिकारिक WhatsApp चैनल 🔗 से जुड़ने के लिए क्लिक ☑️ करे । 👉 कृपया चैनल को Follow अवश्य करें 🙏 </span>
            </a>
          </motion.div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {/* Background Image Layer - Scoped to Middle */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.45] dark:opacity-[0.00] pointer-events-none"
            style={{ 
              backgroundImage: 'url("https://images.jansatta.com/2024/04/Acharya-balkrishna-baba-ramdev-1.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          <div className="absolute inset-0 overflow-y-auto p-4 sm:p-10 space-y-8 pb-24 lg:pb-10 bg-white/40 dark:bg-stone-950/60 backdrop-blur-[1px] z-10">
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
                    "w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-xl shadow-lg overflow-hidden bg-white",
                    message.role === "user" ? "bg-indigo-600 text-white" : "border border-stone-200 dark:border-stone-700"
                  )}>
                    {message.role === "user" ? (
                      "U"
                    ) : (
                      <img 
                        src="https://patanjaliyogacertification.org/img/yogalevel/patanjali.png" 
                        alt="Patanjali" 
                        className="w-full h-full object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div 
                      style={{ 
                        backgroundColor: message.role === "model" ? "#fffbf5" : "#ccdbf4",
                        color: message.role === "user" ? "#000000" : undefined 
                      }}
                      className={cn(
                        "p-5 px-6 text-[14px] leading-relaxed shadow-sm",
                        message.role === "user" 
                          ? "bg-indigo-600 text-white rounded-t-3xl rounded-bl-3xl" 
                          : "bg-white dark:bg-stone-900 dark:text-stone-200 border border-stone-100 dark:border-stone-800 rounded-t-3xl rounded-br-3xl"
                      )}
                    >
                      <div className="markdown-body">
                        <ReactMarkdown>
                          {message.text.replace(/\[YOGA:([a-z-]+)\]/g, "")}
                        </ReactMarkdown>
                      </div>

                      {message.role === "model" && (
                        <button 
                          onClick={() => {
                            if (currentlySpeakingId === index && isSpeaking) {
                              stop();
                              setCurrentlySpeakingId(null);
                            } else {
                              speak(message.text);
                              setCurrentlySpeakingId(index);
                            }
                          }}
                          style={{ backgroundColor: "#dbf4f7" }}
                          className={cn(
                            "mt-3 p-1.5 rounded-lg transition-all float-right",
                            currentlySpeakingId === index && isSpeaking 
                              ? "bg-indigo-500 text-white" 
                              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-stone-800"
                          )}
                        >
                          {currentlySpeakingId === index && isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                    
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
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white shrink-0 flex items-center justify-center text-lg border border-stone-200 dark:border-stone-700 animate-pulse overflow-hidden">
                    <img 
                      src="https://patanjaliyogacertification.org/img/yogalevel/patanjali.png" 
                      alt="Loading" 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="bg-white dark:bg-stone-900 p-4 px-6 rounded-2xl flex gap-1 items-center border border-stone-100 dark:border-stone-800 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-6 relative overflow-hidden">
          {/* Footer Gradient Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-white/80 to-orange-500/10 dark:from-blue-900/10 dark:via-stone-950/80 dark:to-orange-900/10 z-0" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ 
                borderStyle: "inset",
                marginLeft: "0px",
                paddingLeft: "-20px",
                paddingRight: "-20px",
                backgroundColor: "#dff4e2",
                borderRadius: "-5000px"
              }}
              className="flex justify-center flex-wrap gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.query)}
                  className="text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 transition-all hover:border-green-500/30"
                >
                  {s.label}
                </button>
              ))}
            </motion.div>

            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask anything about patanjali wellness..." 
                className="w-full h-16 pl-6 pr-44 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 text-sm transition-all dark:text-stone-100 shadow-inner group-hover:border-green-400/50"
              />
              <div className="absolute right-2 top-2 h-12 flex gap-2">
                <button 
                  onClick={() => isListening ? stopListening() : startListening('hi-IN')}
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
                    isListening 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-white dark:bg-stone-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-stone-100 dark:border-stone-700"
                  )}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-orange-500/20 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isContactFormOpen && (
          <ContactForm onClose={() => setIsContactFormOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTreatmentsOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTreatmentsOpen(false)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[80vh] z-10"
            >
              <button 
                onClick={() => setIsTreatmentsOpen(false)}
                className="absolute -top-12 right-0 sm:-right-12 p-3 text-white hover:text-green-400 transition-colors bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
              <TreatmentDirectory />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/918954666111?text=Hello%20I%20have%20a%20query%20regarding%20Patanjali%20Wellness%20booking."
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl shadow-green-500/40 group cursor-grab active:cursor-grabbing"
        title="Chat on WhatsApp"
        id="floating-whatsapp"
      >
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          <MessageCircle className="w-7 h-7 fill-current" />
        </div>
      </motion.a>
    </div>
  );
}
