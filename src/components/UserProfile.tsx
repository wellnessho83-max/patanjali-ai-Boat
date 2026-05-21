import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  LogOut, 
  CheckCircle2, 
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Upload
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, logout, updateProfileData, uploadProfilePhoto } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setDisplayName(data.displayName || user.displayName || '');
            setPhotoURL(data.photoURL || user.photoURL || '');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      }
    }
    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileData({ displayName, photoURL });
      setIsEditing(false);
      // Refresh local view data
      setUserData((prev: any) => ({ ...prev, displayName, photoURL }));
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large. Please select an image under 2MB.');
      return;
    }

    setIsUploading(true);
    try {
      const downloadURL = await uploadProfilePhoto(file);
      setPhotoURL(downloadURL);
      setUserData((prev: any) => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const contactNumber = "8954666111";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wellness
        </button>

        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          {/* Cover Header */}
          <div className="h-32 bg-gradient-to-r from-orange-400 to-yellow-500 relative">
            {/* Patanjali Wellness Logo */}
            <div className="absolute top-2 bottom-2 right-6 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3 px-6 rounded-[1.5rem] shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <img 
                src="https://patanjaliwellness.com/assets/images/Patanjali-Wellness-logo.png" 
                alt="Patanjali Wellness" 
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </div>
          </div>
          
          <div className="px-8 pb-12 relative">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-6 inline-block">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[2.5rem] bg-white dark:bg-stone-800 p-2 shadow-xl border-4 border-white dark:border-stone-900 group relative cursor-pointer overflow-hidden ${isUploading ? 'opacity-70' : ''}`}
              >
                <img 
                  src={photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.email} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[1.8rem] transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 rounded-[1.8rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Camera className="text-white w-6 h-6" />
                  )}
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h1 className="serif text-3xl font-bold text-stone-800 dark:text-stone-100">
                  {userData?.displayName || user?.displayName || 'Wellness Seeker'}
                </h1>
                <p className="text-stone-500 font-medium flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-bold hover:bg-stone-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:opacity-90 transition-all shadow-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  ) : (
                    <p className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl text-stone-700 dark:text-stone-300 font-medium border border-stone-100 dark:border-stone-700">
                      {displayName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">
                    Avatar URL
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  ) : (
                    <p className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl text-stone-400 dark:text-stone-500 text-xs truncate font-mono border border-stone-100 dark:border-stone-700">
                      {photoURL || 'Use default Google avatar'}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-100 dark:border-orange-800">
                  <h3 className="text-orange-800 dark:text-orange-400 font-bold mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Support & Access
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Main Helpline</p>
                        <a href={`tel:${contactNumber}`} className="text-lg font-bold text-stone-800 dark:text-stone-200 hover:text-orange-600 transition-colors">
                          {contactNumber}
                        </a>
                      </div>
                      <a 
                        href={`tel:${contactNumber}`}
                        className="p-3 bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-orange-100 hover:bg-orange-600 hover:text-white transition-all"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">WhatsApp Support</p>
                        <a 
                          href={`https://wa.me/${contactNumber}`} 
                          target="_blank"
                          className="text-lg font-bold text-green-600 dark:text-green-500 hover:underline transition-colors"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                      <a 
                        href={`https://wa.me/${contactNumber}`}
                        target="_blank"
                        className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl shadow-sm border border-green-100 hover:bg-green-600 hover:text-white transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                  <h3 className="text-indigo-800 dark:text-indigo-400 font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Member Status
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    You are currently using the AI Wellness portal. Your MR Number and historical records are synced with your registered email.
                  </p>
                  <a 
                    href="https://hms.patanjaliwellness.com" 
                    target="_blank"
                    className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline"
                  >
                    Visit Main HMS Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-stone-100 dark:border-stone-800">
              <button 
                onClick={logout}
                className="w-full py-4 rounded-[1.5rem] bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-3"
              >
                <LogOut className="w-5 h-5" />
                Sign Out from Portal
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-stone-400 uppercase tracking-[0.3em] font-medium">
          ॥ स्वस्थस्य स्वास्थ्य रक्षणं आतुरस्य विकार प्रशमनं च ॥
        </p>
      </motion.div>
    </div>
  );
}
