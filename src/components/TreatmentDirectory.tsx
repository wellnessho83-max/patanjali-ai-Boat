import { useState, useMemo } from "react";
import { Search, Info, Leaf, Activity } from "lucide-react";
import { WELLNESS_TREATMENTS, type Treatment } from "../constants/treatments";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function TreatmentDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    WELLNESS_TREATMENTS.forEach(t => {
      const name = t.name || "";
      const parts = name.split(":");
      if (parts.length > 1) {
        cats.add(parts[0].trim());
      } else {
        // Try to guess category from name prefix
        if (name.startsWith("ANTI")) cats.add("Anti-Allergic");
        else if (name.startsWith("POTLI")) cats.add("Potli");
        else if (name.startsWith("MUD")) cats.add("Mud Therapy");
        else if (name.startsWith("ICE")) cats.add("Ice Therapy");
        else if (name.startsWith("IRR")) cats.add("IRR / Heat");
        else if (name.startsWith("IPD")) cats.add("IPD Specific");
        else cats.add("Other");
      }
    });
    return Array.from(cats).sort();
  }, []);

  const filteredTreatments = useMemo(() => {
    const safeSearchQuery = (searchQuery || "").toLowerCase();
    return WELLNESS_TREATMENTS.filter(t => {
      if (!t) return false;
      const name = (t.name || "").toLowerCase();
      const shortName = (t.shortName || "").toLowerCase();
      const matchesSearch = name.includes(safeSearchQuery) || 
                           shortName.includes(safeSearchQuery);
      
      const categoryToMatch = selectedCategory || "";
      const matchesCategory = !selectedCategory || 
                             name.startsWith(categoryToMatch.toLowerCase()) || 
                             (selectedCategory === "Anti-Allergic" && name.includes("ALLERGIC")) ||
                             (selectedCategory === "Other" && !categories.some(c => c && c !== "Other" && name.startsWith(c.toLowerCase())));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, categories]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl">
      <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-stone-900">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-green-600" />
          <h2 className="serif text-xl font-bold text-green-800 dark:text-green-400">Treatment Directory</h2>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-hover:text-green-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search treatments (e.g. Ozone, Mud, Potli)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shrink-0",
              !selectedCategory 
                ? "bg-green-600 text-white shadow-lg shadow-green-500/20" 
                : "bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200"
            )}
          >
            All
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shrink-0",
                selectedCategory === cat
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/20" 
                  : "bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">
          {filteredTreatments.length} Treatments Found
        </p>
        
        {filteredTreatments.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {filteredTreatments.map((t, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                key={`${t.shortName}-${i}`}
                className="group flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 hover:border-green-300 dark:hover:border-green-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm border border-stone-100 dark:border-stone-700 group-hover:scale-110 transition-transform">
                    <Leaf className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{t.name}</p>
                    <p className="text-[9px] text-stone-400 font-mono uppercase tracking-tighter">{t.shortName}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="w-4 h-4 text-stone-300" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No treatments matching your search</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
        <p className="text-[10px] text-stone-500 italic text-center">
          Note: These are clinical treatments available at Patanjali Wellness Haridwar.
        </p>
      </div>
    </div>
  );
}
