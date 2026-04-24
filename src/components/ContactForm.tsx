import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, User, Mail, MessageSquare, Phone, MapPin, Briefcase, Building2, Map, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

import { CONTACT_DATA, WELLNESS_CENTERS } from '../constants/contactData';

interface ContactFormProps {
  onClose: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    center: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.center) {
      newErrors.center = "Please select a wellness center";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    const whatsappNumber = CONTACT_DATA.whatsapp;
    const text = `*New Treatment Inquiry*\n\n` +
                 `*Name:* ${formData.name}\n` +
                 `*Mobile:* ${formData.mobile}\n` +
                 `*Email:* ${formData.email}\n` +
                 `*Center:* ${formData.center || "Not Selected"}\n` +
                 `*Message:* ${formData.message}`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white dark:bg-stone-900 rounded-[40px] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-8 relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-p-saffron via-p-yellow via-p-green to-p-blue"></div>
        <div className="flex flex-col lg:flex-row h-full relative">
          {/* Back Button (New Toggle) */}
          <button 
            onClick={onClose}
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 font-bold text-[10px] uppercase tracking-widest z-20 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Close Button (Now at top level for easy access) */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-400 z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Side: Form (Get In Touch for Treatment) - MOVED TO TOP/LEFT */}
          <div className="flex-1 p-8 pt-20 lg:p-12 lg:pt-24 border-b lg:border-b-0 lg:border-r border-stone-100 dark:border-stone-800">
            <div className="mb-10 lg:pr-12">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-p-blue shadow-[0_0_8px_rgba(0,119,182,0.8)]"></div>
                <p className="text-[10px] font-bold text-p-blue uppercase tracking-[0.3em]">Direct Seva</p>
              </div>
              <h2 className="serif text-4xl font-bold text-stone-800 dark:text-stone-100 mb-3 leading-tight">Treatment Inquiry</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Let us guide you towards holistic healing. Connect with our experts today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 ml-1">Name <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.name ? "text-red-500" : "text-stone-400 group-focus-within:text-p-green")} />
                    <input 
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800/30 border rounded-2xl focus:outline-none focus:ring-4 transition-all",
                        errors.name 
                          ? "border-red-500/50 focus:ring-red-500/5 focus:border-red-500" 
                          : "border-stone-200 dark:border-stone-700/50 focus:ring-p-green/5 focus:border-p-green"
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-[9px] text-red-500 font-bold ml-4 mt-1 uppercase tracking-wider">{errors.name}</p>}
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 ml-1">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.mobile ? "text-red-500" : "text-stone-400 group-focus-within:text-p-green")} />
                    <input 
                      required
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800/30 border rounded-2xl focus:outline-none focus:ring-4 transition-all",
                        errors.mobile
                          ? "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
                          : "border-stone-200 dark:border-stone-700/50 focus:ring-p-green/5 focus:border-p-green"
                      )}
                    />
                  </div>
                  {errors.mobile && <p className="text-[9px] text-red-500 font-bold ml-4 mt-1 uppercase tracking-wider">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 ml-1">E-mail Id <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.email ? "text-red-500" : "text-stone-400 group-focus-within:text-p-green")} />
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800/30 border rounded-2xl focus:outline-none focus:ring-4 transition-all",
                        errors.email
                          ? "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
                          : "border-stone-200 dark:border-stone-700/50 focus:ring-p-green/5 focus:border-p-green"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-[9px] text-red-500 font-bold ml-4 mt-1 uppercase tracking-wider">{errors.email}</p>}
                </div>

                {/* Center Dropdown */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 ml-1">Select Center <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Map className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.center ? "text-red-500" : "text-stone-400 group-focus-within:text-p-green pointer-events-none")} />
                    <select 
                      required
                      name="center"
                      value={formData.center}
                      onChange={handleChange}
                      className={cn(
                        "w-full pl-12 pr-10 py-4 bg-stone-50 dark:bg-stone-800/30 border rounded-2xl focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer",
                        errors.center
                          ? "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
                          : "border-stone-200 dark:border-stone-700/50 focus:ring-p-green/5 focus:border-p-green"
                      )}
                    >
                      <option value="">Select Wellness Center</option>
                      {WELLNESS_CENTERS.map((center, idx) => (
                        <option key={idx} value={center}>{center}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errors.center && <p className="text-[9px] text-red-500 font-bold ml-4 mt-1 uppercase tracking-wider">{errors.center}</p>}
                </div>
              </div>

              {/* Remark/Message */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 ml-1">Message <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <MessageSquare className={cn("absolute left-4 top-4 w-4 h-4 transition-colors", errors.message ? "text-red-500" : "text-stone-400 group-focus-within:text-p-green")} />
                  <textarea 
                    required
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your health concerns..."
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800/30 border rounded-2xl focus:outline-none focus:ring-4 transition-all resize-none",
                      errors.message
                        ? "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
                        : "border-stone-200 dark:border-stone-700/50 focus:ring-p-green/5 focus:border-p-green"
                    )}
                  />
                </div>
                {errors.message && <p className="text-[9px] text-red-500 font-bold ml-4 mt-1 uppercase tracking-wider">{errors.message}</p>}
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-p-green to-emerald-700 hover:shadow-2xl hover:shadow-p-green/40 text-white font-bold rounded-[20px] shadow-xl shadow-p-green/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase tracking-widest group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Submit Secure Inquiry
              </button>
            </form>
          </div>

          {/* Right Side: Contact Info (Reach Us) */}
          <div className="lg:w-[35%] bg-stone-50/50 dark:bg-stone-800/30 p-8 lg:p-12 lg:pt-24 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-p-yellow/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-p-blue/5 rounded-full blur-3xl"></div>
            
            <div className="mb-10 relative z-10">
              <h1 className="serif text-2xl font-bold text-p-green dark:text-p-sage mb-4 leading-tight">Professional Support</h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-semibold opacity-80">
                Experience the heritage of Ayurveda with world-class medical facilities and integrated wellness.
              </p>
            </div>

            <div className="space-y-8">
              {CONTACT_DATA.helpline.map((group, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-p-green/10 text-p-green rounded-xl">
                      <Phone className="w-5 h-5" />
                    </div>
                    <h3 className="serif text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest">{group.label}</h3>
                  </div>
                  <div className="flex flex-col gap-2 pl-12 text-sm font-bold text-stone-600 dark:text-stone-400">
                    {group.phones.map((phone, pIdx) => (
                      <a key={pIdx} href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="hover:text-p-green transition-colors">{phone}</a>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-p-saffron/10 text-p-saffron rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="serif text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest">Email Us</h3>
                </div>
                <div className="flex flex-col gap-2 pl-12 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  {CONTACT_DATA.emails.map((item, idx) => (
                    <a key={idx} href={`mailto:${item.email}`} className="hover:text-p-saffron transition-colors">{item.email}</a>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="serif text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest">Address</h3>
                </div>
                <div className="pl-12 text-[11px] font-medium text-stone-500 dark:text-stone-400 italic leading-relaxed">
                  {CONTACT_DATA.address}
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-3">
              <a 
                href="https://patanjaliwellness.com/job.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl hover:border-p-green transition-all"
              >
                <Briefcase className="w-4 h-4 text-p-green" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Careers</span>
              </a>
              <a 
                href="https://patanjaliwellness.com/franchise.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl hover:border-p-saffron transition-all"
              >
                <Building2 className="w-4 h-4 text-p-saffron" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Franchise</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
