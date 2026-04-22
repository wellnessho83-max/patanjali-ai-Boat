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
  Wind
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { chatWithWellnessAI } from "./services/geminiService";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { id: 1, label: "हिंदी में बात करें", query: "मैं हिंदी में बात करना चाहता हूँ।" },
  { id: 2, label: "Continue in English", query: "I want to continue in English." },
  { id: 3, label: "Follow-up Token Info", query: "What is the timing and process for follow-up tokens?" },
  { id: 4, label: "Doctors on Leave", query: "Which doctors are currently on leave?" },
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Live Doctors on Mount
  useEffect(() => {
    const fetchLiveDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (data.doctors && data.onLeave) {
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
    <div className="flex h-screen w-full overflow-hidden bg-p-cream">
      {/* Sidebar: Wellness Context */}
      <aside className="hidden lg:flex w-80 h-full border-r border-stone-200 p-6 flex-col gap-6 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-p-saffron rounded-full flex items-center justify-center text-white font-bold serif text-xl shadow-md">
            P
          </div>
          <span className="font-semibold text-lg tracking-tight serif">Ayu-Assistant</span>
        </div>

        <div className="space-y-4">
          <div className="px-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-2 h-2 rounded-full", lastUpdated ? "bg-green-500 animate-pulse" : "bg-stone-300")} />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {lastUpdated ? `Live Sync: ${lastUpdated}` : "Connecting..."}
              </span>
            </div>
            {doctorStats && (
              <div className="flex gap-3 text-[9px] font-bold uppercase tracking-tight">
                <span className="text-green-600/70">{doctorStats.available} Available</span>
                <span className="text-stone-400/70">{doctorStats.onLeave} On Leave</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-3xl bg-p-stone/10 border border-p-stone/20">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-3 h-3 text-p-stone" />
              <h3 className="serif text-[10px] font-bold text-p-stone uppercase tracking-wider">Daily Dosha Balance</h3>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 font-medium">Vata levels are high today. Favor warm, grounding meals and herbal teas.</p>
          </div>

          <div className="p-4 rounded-3xl bg-p-stone/10 border border-p-stone/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-p-stone" />
              <h3 className="serif text-[10px] font-bold text-p-stone uppercase tracking-wider">Registration & Tokens</h3>
            </div>
            <p className="text-[10px] leading-relaxed text-stone-600 font-medium">Follow-up Reg starts at 06:00 AM at main counter. First-come, first-served.</p>
          </div>

          <div className="p-4 rounded-3xl bg-p-saffron/5 border border-p-saffron/10">
            <h3 className="serif text-xs font-bold text-p-saffron mb-3">Ayurvedic Spotlight</h3>
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                🌿
              </div>
              <div>
                <p className="text-[11px] font-bold">Ashwagandha</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-tighter">Stress Relief & Vitality</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-stone-200">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-4">Core Recommendations</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-stone-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Honey & Tulsi Tea
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> Aloe Vera Juice
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-p-stone/30"></span> Dant Kanti Advanced
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-5 bg-stone-800 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2 opacity-70">
            <Sparkles className="w-3 h-3" />
            <p className="text-[9px] font-bold tracking-widest uppercase">Yog Guru Says</p>
          </div>
          <p className="text-xs italic serif leading-relaxed">
            "Health is not just being disease-free. It is a state of physical, mental, and spiritual harmony."
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full bg-p-cream">
        {/* Header Navigation */}
        <header className="h-20 border-b border-stone-200 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
            <h2 className="serif text-xl font-bold text-p-green">Patanjali AI Bot</h2>
          </div>
          <div className="flex gap-3">
            <button className="hidden sm:block px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
              Product Catalog
            </button>
            <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-p-green text-white rounded-full shadow-lg shadow-p-green/20 hover:scale-105 transition-transform flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              Locate Store
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 scrollbar-hide">
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
                  "w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-lg shadow-inner",
                  message.role === "user" ? "bg-p-saffron text-white font-bold text-xs" : "bg-stone-100 border border-stone-200"
                )}>
                  {message.role === "user" ? "AS" : (index === 0 ? "🧘" : "🌿")}
                </div>
                <div className={cn(
                  "p-4 px-5 text-sm leading-relaxed",
                  message.role === "user" ? "bubble-user" : "bubble-bot"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 max-w-[80%]">
                <div className="w-10 h-10 rounded-full bg-stone-100 shrink-0 flex items-center justify-center text-lg border border-stone-200 font-sans">
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
        <div className="w-full p-8 pt-0 bg-gradient-to-t from-p-cream via-p-cream to-transparent relative z-10">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask about Chyawanprash, Yoga poses, or Skin care..." 
                className="w-full h-16 pl-6 pr-44 bg-white border border-stone-200 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-p-green/30 text-sm font-medium transition-all"
              />
              <div className="absolute right-2 top-2 h-12 flex gap-2">
                <button className="h-12 w-12 rounded-full bg-stone-50 flex items-center justify-center hover:bg-stone-100 border border-stone-100 transition-colors group">
                  <Mic className="w-5 h-5 text-stone-400 group-hover:text-p-saffron transition-colors" />
                </button>
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="h-12 px-8 rounded-full bg-p-green text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-p-green/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
            
        <div className="flex justify-center flex-wrap gap-4 px-4 overflow-hidden">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.query)}
                  className="text-[9px] text-stone-400 font-bold uppercase tracking-wider cursor-pointer hover:text-p-saffron transition-colors hover:underline underline-offset-4"
                >
                  {s.label}
                </button>
              ))}
              <a 
                href="https://patanjaliwellness.com/term&condition.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] text-stone-400 font-bold uppercase tracking-wider cursor-pointer hover:text-p-saffron transition-colors hover:underline underline-offset-4"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Background Motifs */}
      <div className="fixed top-20 right-0 -z-0 opacity-[0.03] pointer-events-none rotate-12">
        <Leaf className="w-[500px] h-[500px]" />
      </div>
    </div>
  );
}
