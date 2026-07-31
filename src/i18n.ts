import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app": {
        "title": "TERRA FOX",
        "subtitle": "VIT Bhopal Campus GPS",
        "live_gps": "LIVE GPS"
      },
      "nav": {
        "route": "Route",
        "directory": "Directory",
        "start_point": "Start Point",
        "destination": "Destination",
        "my_location": "📍 My Location (Current GPS)",
        "select_dest": "Select destination building...",
        "walk": "Walk",
        "run": "Run",
        "cycle": "Cycle",
        "distance": "Distance",
        "est_time": "Est. Time",
        "meters": "meters",
        "mins": "mins",
        "turn_by_turn": "Turn-by-Turn Directions",
        "view_all_steps": "View all {{count}} steps",
        "collapse": "Collapse",
        "clear_route": "Clear Route",
        "click_any_building": "Click Any Building to Navigate",
        "click_any_building_desc": "Click or hover over any building on the map or directory below to instantly set it as destination and route from",
        "search_placeholder": "Search buildings or codes...",
        "search_block": "Search block...",
        "route_here": "Route Here from My Location",
        "view_3d": "View 3D",
        "no_buildings": "No buildings match your search."
      }
    }
  },
  hi: {
    translation: {
      "app": {
        "title": "टेरा फॉक्स",
        "subtitle": "वीआईटी भोपाल कैंपस जीपीएस",
        "live_gps": "लाइव जीपीएस"
      },
      "nav": {
        "route": "रास्ता",
        "directory": "निर्देशिका",
        "start_point": "शुरुआती बिंदु",
        "destination": "मंजिल",
        "my_location": "📍 मेरी लोकेशन (वर्तमान जीपीएस)",
        "select_dest": "मंजिल वाली इमारत चुनें...",
        "walk": "चलना",
        "run": "दौड़ना",
        "cycle": "साइकिल",
        "distance": "दूरी",
        "est_time": "अनुमानित समय",
        "meters": "मीटर",
        "mins": "मिनट",
        "turn_by_turn": "कदम-दर-कदम निर्देश",
        "view_all_steps": "सभी {{count}} कदम देखें",
        "collapse": "छोटा करें",
        "clear_route": "रास्ता साफ करें",
        "click_any_building": "नेविगेट करने के लिए किसी भी इमारत पर क्लिक करें",
        "click_any_building_desc": "नक्शे या नीचे दी गई निर्देशिका में किसी भी इमारत पर क्लिक करें या होवर करें, ताकि उसे तुरंत मंजिल सेट किया जा सके और वहां तक का रास्ता देखा जा सके",
        "search_placeholder": "इमारतों या कोड को खोजें...",
        "search_block": "ब्लॉक खोजें...",
        "route_here": "मेरी लोकेशन से यहां का रास्ता",
        "view_3d": "3D में देखें",
        "no_buildings": "आपकी खोज से कोई इमारत मेल नहीं खाती।"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
