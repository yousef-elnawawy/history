import React from "react";
import { BookOpen, Compass, Info, HelpCircle, Menu, X, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  currentView: string;
  setView: (view: "home" | "quiz" | "about" | "explore") => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function Navbar({ currentView, setView, isMuted, onToggleMute }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: "home", label: "الرئيسية", icon: Compass },
    { id: "quiz", label: "بدء الفوازير", icon: HelpCircle },
    { id: "explore", label: "مستكشف الفوازير", icon: BookOpen },
    { id: "about", label: "عن المطور", icon: Info },
  ] as const;

  return (
    <nav className="bg-emerald-950 text-parchment-100 shadow-xl fixed w-full top-0 z-50 border-b border-amber-500/30 font-sans">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => { setView("home"); setIsOpen(false); }}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="bg-amber-500 text-emerald-950 p-2 rounded-lg shadow-inner group-hover:bg-amber-400 transition-colors">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-wide text-amber-400 group-hover:text-amber-300 transition-colors">
              فوازير التاريخ
            </h1>
            <p className="text-[10px] text-emerald-300 font-sans tracking-widest hidden sm:block">
              أسرار الحضارات وعظماء الأمم
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex gap-1.5 font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === "quiz" && currentView === "quiz_playing");
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-amber-500 text-emerald-950 font-bold shadow-md transform -translate-y-0.5"
                        : "text-parchment-200 hover:text-amber-400 hover:bg-emerald-900/40"
                    }`}
                    id={`nav-item-${item.id}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="w-px h-6 bg-emerald-800/80"></div>

          <button
            onClick={onToggleMute}
            className="flex items-center justify-center p-2 rounded-lg bg-emerald-900/40 border border-amber-500/20 text-amber-400 hover:text-amber-300 hover:bg-emerald-900/80 transition-all cursor-pointer"
            title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            id="desktop-mute-btn"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-stone-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Mobile menu button and Sound trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleMute}
            className="flex items-center justify-center p-2 rounded-lg bg-emerald-900/40 border border-amber-500/20 text-amber-400 hover:text-amber-300 hover:bg-emerald-900/80 transition-all cursor-pointer"
            title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            id="mobile-mute-btn"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-stone-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-amber-400 hover:text-amber-300 focus:outline-none p-1.5 rounded-lg border border-emerald-800"
            aria-label="Toggle menu"
            id="mobile-menu-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-emerald-950 border-b border-amber-500/30 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200">
          <ul className="flex flex-col p-4 gap-2 text-right">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === "quiz" && currentView === "quiz_playing");
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setView(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-right font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500 text-emerald-950 font-bold"
                        : "text-parchment-200 hover:bg-emerald-900/60 hover:text-amber-400"
                    }`}
                    id={`mobile-nav-item-${item.id}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-amber-500" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
