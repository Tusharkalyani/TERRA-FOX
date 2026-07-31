import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Navigation, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  Minimize2,
  Utensils,
  Maximize2
} from "lucide-react";
import { buildings } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import type { CampusDisruption } from "../data/disruptionsData";

interface ChatAssistantProps {
  onRouteToBuilding: (building: CampusNode) => void;
  onSelectBuilding?: (building: CampusNode) => void;
  onView3D?: (building: CampusNode) => void;
  onOpenIndoorNav?: (buildingId: "AB1" | "AB2") => void;
  disruptions?: CampusDisruption[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  buildingAction?: CampusNode;
  suggestedQuestions?: string[];
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  onRouteToBuilding,
  onSelectBuilding,
  onView3D,
  onOpenIndoorNav,
  disruptions = []
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "👋 Hi! I'm **TerraFox AI**, your campus assistant. Ask me for directions, food spots, hostels, or active road blocks!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "📍 Route to Academic Block 1",
        "🍔 Cafeterias & Food Spots",
        "🏠 Boys & Girls Hostels",
        "🚧 Active Road Blocks",
        "🆘 Emergency Contacts"
      ]
    }
  ]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Smart Query Parser
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    // Simulate AI response delay for natural conversational feel
    setTimeout(() => {
      const response = generateAIResponse(query);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  // AI Response Generator Engine
  const generateAIResponse = (query: string): ChatMessage => {
    const qLower = query.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Check for specific building search matches
    const matchedBuilding = buildings.find(
      (b) =>
        b.name.toLowerCase().includes(qLower) ||
        b.id.toLowerCase() === qLower ||
        (qLower.includes("ab1") && b.id === "AB1") ||
        (qLower.includes("ab2") && b.id === "AB2") ||
        (qLower.includes("lab") && b.id === "LAB") ||
        (qLower.includes("mayuri") && b.id === "MAYURI") ||
        (qLower.includes("underbelly") && b.id === "UNDERBELLY") ||
        (qLower.includes("hospital") && b.id === "HOSPITAL") ||
        (qLower.includes("safal") && b.id === "SAFAL") ||
        (qLower.includes("parcel") && b.id === "PARCEL PICKUP")
    );

    if (matchedBuilding) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `📍 Found **${matchedBuilding.name}**! ${matchedBuilding.description || 'Located on campus.'} Click below to calculate the red navigation route directly on the map.`,
        timestamp: timeStr,
        buildingAction: matchedBuilding,
        suggestedQuestions: ["Show 3D model", "Check food spots nearby", "Back to main menu"]
      };
    }

    // 2. Food / Cafeteria Inquiry
    if (qLower.includes("food") || qLower.includes("eat") || qLower.includes("cafeteria") || qLower.includes("snack") || qLower.includes("dining") || qLower.includes("underbelly") || qLower.includes("mayuri")) {
      const mayuri = buildings.find((b) => b.id === "MAYURI");
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "🍔 **Campus Food & Dining Spots:**\n\n1. **Mayuri Cafe**: Regular meals, tea & snacks.\n2. **Underbelly**: Popular student food court & social hangout.\n3. **Safal Shop**: Daily snacks, beverages & groceries.",
        timestamp: timeStr,
        buildingAction: mayuri,
        suggestedQuestions: ["📍 Route to Mayuri Cafe", "📍 Route to Underbelly", "📍 Route to Safal"]
      };
    }

    // 3. Hostel Inquiry
    if (qLower.includes("hostel") || qLower.includes("room") || qLower.includes("dorm") || qLower.includes("stay") || qLower.includes("bh") || qLower.includes("gh")) {
      const bh1 = buildings.find((b) => b.id === "BH1");
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "🏠 **Campus Student Hostels:**\n\n• **Boys Hostels**: Blocks BH1 to BH8.\n• **Girls Hostels**: Blocks GH1 & GH2.\n\nWhich hostel block would you like to navigate to?",
        timestamp: timeStr,
        buildingAction: bh1,
        suggestedQuestions: ["Route to BH1", "Route to BH3", "Route to GH1", "Route to GH2"]
      };
    }

    // 4. Disruptions / Roadblocks Inquiry
    if (qLower.includes("disruption") || qLower.includes("block") || qLower.includes("construction") || qLower.includes("road") || qLower.includes("closure") || qLower.includes("traffic")) {
      const activeCount = disruptions.filter((d) => d.active).length;
      if (activeCount > 0) {
        const activeTitles = disruptions
          .filter((d) => d.active)
          .map((d) => `• 🚧 **${d.title}**: ${d.description}`)
          .join("\n");
        return {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `⚠️ **Active Campus Road Blockades (${activeCount}):**\n\n${activeTitles}\n\n*Note: Our A* Pathfinder automatically calculates an alternate path around these blocked nodes.*`,
          timestamp: timeStr,
          suggestedQuestions: ["📍 Route to Academic Block 1", "Emergency Contacts"]
        };
      }
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "✅ **No Active Road Blockades!** All campus pathways and walkways are currently open for clear navigation.",
        timestamp: timeStr,
        suggestedQuestions: ["📍 Route to AB1", "Find Cafeteria"]
      };
    }

    // 5. Emergency Inquiry
    if (qLower.includes("emergency") || qLower.includes("hospital") || qLower.includes("medical") || qLower.includes("doctor") || qLower.includes("help") || qLower.includes("sos")) {
      const hospital = buildings.find((b) => b.id === "HOSPITAL");
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "🆘 **Campus Emergency & Medical Care:**\n\n• **Morphen Hospital**: Campus medical clinic for primary healthcare.\n• **Campus Security Control Room**: Available 24/7.\n• **Emergency Helpline**: +91-1800-TERRA-FOX",
        timestamp: timeStr,
        buildingAction: hospital,
        suggestedQuestions: ["📍 Route to Morphen Hospital", "Find Security Office"]
      };
    }

    // 6. Academic & Labs Inquiry
    if (qLower.includes("academic") || qLower.includes("class") || qLower.includes("lecture") || qLower.includes("lab") || qLower.includes("study") || qLower.includes("architecture")) {
      const ab1 = buildings.find((b) => b.id === "AB1");
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "📚 **Academic & Research Buildings:**\n\n1. **Academic Block 1 (AB1)**: Main lecture halls & 3D structure viewer.\n2. **Academic Block 2 (AB2)**: Theoretical classrooms.\n3. **Lab Complex**: Research laboratories & placement cell.\n4. **Architecture Building**: Studios & design labs.",
        timestamp: timeStr,
        buildingAction: ab1,
        suggestedQuestions: ["📍 Route to AB1", "📍 Route to Lab Complex", "📍 Route to AB2"]
      };
    }

    // Default Fallback
    return {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: `I can help you navigate to any location on campus or answer questions about facilities! Try picking one of the quick topics below or type a building name like **"AB1"**, **"Hostel"**, or **"Mayuri"**.`,
      timestamp: timeStr,
      suggestedQuestions: [
        "📍 Route to Academic Block 1",
        "🍔 Cafeterias & Food",
        "🏠 Student Hostels",
        "🚧 Active Road Blocks"
      ]
    };
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-auto flex flex-col items-end">
      {/* Expanded Chat Drawer Container */}
      {isOpen && (
        <div
          className={`mb-3.5 transition-all duration-300 transform origin-bottom-right flex flex-col bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden ${
            isExpanded
              ? "w-[92vw] sm:w-[500px] h-[80vh] sm:h-[620px]"
              : "w-[88vw] sm:w-[380px] h-[500px]"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 px-4 py-3.5 border-b border-slate-700/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900 border border-rose-500/50 text-rose-400 shadow-md shadow-slate-950">
                <Bot className="w-5 h-5 text-rose-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs text-white tracking-wide">
                    TERRA-FOX AI
                  </h3>
                  <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 text-[9px] font-black rounded-md border border-rose-500/30 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Assistant
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">
                  Campus Guide & Smart Navigator
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                title={isExpanded ? "Collapse Window" : "Expand Window"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-br-xs shadow-md shadow-rose-900/30"
                      : "bg-slate-800/90 text-slate-100 border border-slate-700/70 rounded-bl-xs shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  {/* Interactive Action Card if a building match is attached */}
                  {msg.buildingAction && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-[11px] text-rose-300 flex items-center gap-1 truncate">
                          <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          {msg.buildingAction.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase">
                          {msg.buildingAction.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (msg.buildingAction) {
                              onRouteToBuilding(msg.buildingAction);
                              if (onSelectBuilding) onSelectBuilding(msg.buildingAction);
                            }
                          }}
                          className="flex-1 py-1.5 px-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <Navigation className="w-3 h-3 fill-current rotate-45" />
                          Route Here (Red Path)
                        </button>

                        {(msg.buildingAction.id === "AB1" || msg.buildingAction.id === "AB2") && (
                          <button
                            onClick={() => {
                              if (msg.buildingAction && onOpenIndoorNav) {
                                onOpenIndoorNav(msg.buildingAction.id as "AB1" | "AB2");
                              }
                            }}
                            className="py-1.5 px-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-[10px] rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            🗺️ Indoor Map
                          </button>
                        )}

                        {msg.buildingAction.id === "AB1" && onView3D && (
                          <button
                            onClick={() => {
                              if (msg.buildingAction) onView3D(msg.buildingAction);
                            }}
                            className="py-1.5 px-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                          >
                            3D Model
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 text-right font-mono ${
                      msg.sender === "user" ? "text-rose-200/70" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Quick Suggestion Chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q.replace(/^📍\s*|^🍔\s*|^🏠\s*|^🚧\s*|^🆘\s*/, ""))}
                        className="px-2.5 py-1 bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-[10px] font-extrabold rounded-xl border border-slate-700/80 transition-all cursor-pointer shadow-sm text-left flex items-center gap-1"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 max-w-[120px] animate-pulse">
                <Bot className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] text-slate-400 font-bold">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Categories Bar */}
          <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
            <button
              onClick={() => handleSendMessage("Academic Block 1")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-2.5 h-2.5 text-rose-400" /> AB1
            </button>
            <button
              onClick={() => handleSendMessage("Cafeterias")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Utensils className="w-2.5 h-2.5 text-amber-400" /> Food
            </button>
            <button
              onClick={() => handleSendMessage("Hostels")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-2.5 h-2.5 text-emerald-400" /> Hostels
            </button>
            <button
              onClick={() => handleSendMessage("Disruptions")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" /> Blocks
            </button>
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-700/80 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask assistant about campus..."
                className="flex-1 bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-medium text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md shadow-rose-900/40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Trigger Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasUnread(false);
        }}
        className="relative group flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-slate-900/95 dark:bg-slate-950/95 text-white rounded-2xl shadow-2xl shadow-slate-950/80 hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-rose-500/60 backdrop-blur-xl"
        title="Open TERRA-FOX AI Assistant"
      >
        {/* Animated Glow Ring */}
        <span className="absolute -inset-1 rounded-2xl bg-rose-500/25 opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none"></span>

        {/* Icon & Label */}
        <div className="relative z-10 flex items-center gap-2">
          {isOpen ? (
            <X className="w-5 h-5 text-rose-400" />
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Bot className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" />
                <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1" />
              </div>
              <span className="hidden group-hover:inline-block font-extrabold text-xs tracking-wider pr-1 text-rose-200">
                AI Assistant
              </span>
            </>
          )}
        </div>

        {/* Floating Notification Badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-slate-900 text-[8px] font-black text-white items-center justify-center">
              1
            </span>
          </span>
        )}
      </button>
    </div>
  );
};
