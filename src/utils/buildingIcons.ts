import type { CampusNode } from "../data/campusData";
import { 
  Coffee, 
  Utensils,
  Laptop, 
  Compass, 
  GraduationCap, 
  BookOpen,
  Home, 
  HeartPulse, 
  ShoppingBag, 
  Package, 
  Trophy, 
  Sparkles, 
  Building2,
  MapPin
} from "lucide-react";

export interface CategoryInfo {
  label: string;
  defaultPinBg: string;
  ringClass: string;
  badgeBg: string;
  iconSvg: string;
  IconComponent: any;
}

export function getBuildingCategoryInfo(node: CampusNode): CategoryInfo {
  const id = node.id.toUpperCase();

  // 1. Mayuri Cafe
  if (id === "MAYURI") {
    return {
      label: "Mayuri Cafe",
      defaultPinBg: "bg-amber-500 text-white border-white shadow-amber-500/40",
      ringClass: "border-amber-400",
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      IconComponent: Coffee,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`
    };
  }

  // 2. Underbelly Food Court
  if (id === "UNDERBELLY") {
    return {
      label: "Underbelly Food Court",
      defaultPinBg: "bg-orange-500 text-white border-white shadow-orange-500/40",
      ringClass: "border-orange-400",
      badgeBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      IconComponent: Utensils,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V2"/><line x1="12" x2="12" y1="2" y2="22"/><line x1="6" x2="6" y1="2" y2="8"/><line x1="18" x2="18" y1="2" y2="8"/></svg>`
    };
  }

  // 3. Lab Complex
  if (id === "LAB") {
    return {
      label: "Lab Complex",
      defaultPinBg: "bg-indigo-600 text-white border-white shadow-indigo-500/40",
      ringClass: "border-indigo-400",
      badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      IconComponent: Laptop,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/><path d="M9 12h6"/></svg>`
    };
  }

  // 4. Architecture Building
  if (id === "ARCH") {
    return {
      label: "Architecture Building",
      defaultPinBg: "bg-violet-600 text-white border-white shadow-violet-500/40",
      ringClass: "border-violet-400",
      badgeBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      IconComponent: Compass,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
    };
  }

  // 5. Academic Block 1
  if (id === "AB1") {
    return {
      label: "Academic Block 1",
      defaultPinBg: "bg-blue-600 text-white border-white shadow-blue-500/40",
      ringClass: "border-blue-400",
      badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      IconComponent: GraduationCap,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
    };
  }

  // 6. Academic Block 2
  if (id === "AB2") {
    return {
      label: "Academic Block 2",
      defaultPinBg: "bg-sky-600 text-white border-white shadow-sky-500/40",
      ringClass: "border-sky-400",
      badgeBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      IconComponent: BookOpen,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
    };
  }

  // 7. Boys Hostels (BH1-BH8)
  if (id.startsWith("BH")) {
    return {
      label: `Boys Hostel (${id})`,
      defaultPinBg: "bg-purple-600 text-white border-white shadow-purple-500/40",
      ringClass: "border-purple-400",
      badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      IconComponent: Home,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    };
  }

  // 8. Girls Hostels (GH1, GH2)
  if (id.startsWith("GH")) {
    return {
      label: `Girls Hostel (${id})`,
      defaultPinBg: "bg-pink-600 text-white border-white shadow-pink-500/40",
      ringClass: "border-pink-400",
      badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      IconComponent: Home,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    };
  }

  // 9. Morphen Hospital
  if (id === "HOSPITAL") {
    return {
      label: "Morphen Hospital",
      defaultPinBg: "bg-rose-600 text-white border-white shadow-rose-500/40",
      ringClass: "border-rose-400",
      badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      IconComponent: HeartPulse,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a1 1 0 0 1 2 0v7h7a1 1 0 0 1 0 2h-7v7a1 1 0 0 1-2 0v-7H4a1 1 0 0 1 0-2h7V2z"/></svg>`
    };
  }

  // 10. Campus Store
  if (id === "STORE") {
    return {
      label: "Campus Store",
      defaultPinBg: "bg-emerald-600 text-white border-white shadow-emerald-500/40",
      ringClass: "border-emerald-400",
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      IconComponent: ShoppingBag,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
    };
  }

  // 11. Parcel Pickup Point
  if (id === "PARCEL") {
    return {
      label: "Parcel Pickup Point",
      defaultPinBg: "bg-teal-600 text-white border-white shadow-teal-500/40",
      ringClass: "border-teal-400",
      badgeBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      IconComponent: Package,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24a2 2 0 0 0-2 0l-2 1.15a2 2 0 0 0-1 1.73v9.76a2 2 0 0 0 1 1.73l9.5 5.48a2 2 0 0 0 2 0l9.5-5.48a2 2 0 0 0 1-1.73V7.12a2 2 0 0 0-1-1.73l-2-1.15a2 2 0 0 0-2 0l-3.55 2.05"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>`
    };
  }

  // 12. MPH (Multi-Purpose Hall)
  if (id === "MPH") {
    return {
      label: "Multi-Purpose Hall",
      defaultPinBg: "bg-cyan-600 text-white border-white shadow-cyan-500/40",
      ringClass: "border-cyan-400",
      badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      IconComponent: Trophy,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`
    };
  }

  // 13. Special Block
  if (id === "SPECIAL") {
    return {
      label: "Special Block",
      defaultPinBg: "bg-amber-600 text-white border-white shadow-amber-500/40",
      ringClass: "border-amber-400",
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      IconComponent: Sparkles,
      iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`
    };
  }

  // Default Pin
  return {
    label: node.name || "Building",
    defaultPinBg: "bg-slate-700 text-white border-white shadow-slate-500/40",
    ringClass: "border-slate-400",
    badgeBg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    IconComponent: node.isBuilding ? Building2 : MapPin,
    iconSvg: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
  };
}
