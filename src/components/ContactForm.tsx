import { motion, AnimatePresence } from "motion/react";
import { X, Send, Calendar, User, Phone, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ContactFormProps {
  onClose: () => void;
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    query: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare WhatsApp Message
    const message = `*Patanjali Wellness Booking Request*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email || 'N/A'}\n` +
      `*Health Query:* ${formData.query}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918954666111?text=${encodedMessage}`;

    // Simulate short processing then redirect
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors z-10"
        >
          <X className="w-5 h-5 text-stone-500" />
        </button>

        <div className="p-8 lg:p-12">
          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Calendar className="w-3 h-3" />
                  Booking Request
                </div>
                <h2 className="serif text-3xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                  Start Your <span className="text-[#2D6A4F] italic">Healing</span> Journey
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Fill in your details and our experts will reach out to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Yogesh Kumar" 
                        className="w-full h-12 pl-11 pr-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 text-sm transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 99999 99999" 
                        className="w-full h-12 pl-11 pr-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 text-sm transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="wellness@patanjali.com" 
                      className="w-full h-12 pl-11 pr-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 text-sm transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Health Query / Condition</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-stone-400" />
                    <textarea 
                      required
                      rows={3}
                      value={formData.query}
                      onChange={(e) => setFormData({...formData, query: e.target.value})}
                      placeholder="E.g. Seeking treatment for Chronic Back Pain..." 
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 text-sm transition-all dark:text-white resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-[#2D6A4F] to-[#2B3A67] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#2D6A4F]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="serif text-3xl font-black text-stone-900 dark:text-stone-100 mb-4">Request Received!</h2>
              <p className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                Thank you for reaching out. A Patanjali Wellness representative will contact you shortly to discuss your health requirements.
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
