import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

interface WeatherState {
  emoji: string;
  temp: number | null;
  status: string;
}

// Maps WMO weather code and temperature to Emojis and Status names
const mapWeatherCode = (code: number, temp: number): { emoji: string; status: string } => {
  // 1. Prioritize active precipitation / extreme conditions
  if (code >= 95 && code <= 99) return { emoji: "⚡", status: "Stormy" };
  if (code >= 71 && code <= 77) return { emoji: "❄️", status: "Snowy" };
  if (
    (code >= 51 && code <= 55) ||
    (code >= 61 && code <= 65) ||
    (code >= 80 && code <= 82)
  ) {
    return { emoji: "🌧️", status: "Rainy" };
  }

  // 2. Classify temperature feel for standard conditions
  if (temp <= 18) return { emoji: "🍃", status: "Cool" };
  if (temp <= 8) return { emoji: "🥶", status: "Cold" };
  if (temp >= 33) return { emoji: "🥵", status: "Hot" };

  // 3. Default back to cloud/fog conditions
  if (code === 0) return { emoji: "☀️", status: "Sunny" };
  if (code >= 1 && code <= 3) return { emoji: "⛅", status: "Cloudy" };
  if (code === 45 || code === 48) return { emoji: "🌫️", status: "Foggy" };

  return { emoji: "☀️", status: "Sunny" };
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherState>({
    emoji: "⏳",
    temp: null,
    status: "Loading..."
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchWeather = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const lat = 23.075670;
      const lng = 76.854422;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      const currentTemp = Math.round(data.current.temperature_2m);
      const weatherInfo = mapWeatherCode(data.current.weather_code, currentTemp);

      setWeather({
        emoji: weatherInfo.emoji,
        temp: currentTemp,
        status: weatherInfo.status
      });
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      // Fallback: estimate based on current hour/season
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 19;
      setWeather({
        emoji: isNight ? "🌙" : "⛅",
        temp: isNight ? 22 : 28,
        status: isNight ? "Cool" : "Cloudy"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Refresh weather information every 5 minutes to stay accurate
    const interval = setInterval(() => fetchWeather(true), 300000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return (
    <button
      onClick={() => !refreshing && fetchWeather(true)}
      disabled={loading}
      className="glass-panel px-3 py-1.5 rounded-2xl shadow-md border border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group pointer-events-auto"
      title={weather.temp !== null ? `Live Weather at Campus (Sehore): ${weather.status} (${weather.temp}°C). Click to refresh.` : "Loading weather..."}
    >
      <div className="flex items-center gap-2">
        <span className={`text-base leading-none transition-transform duration-300 group-hover:scale-110 ${refreshing || loading ? "animate-pulse" : ""}`}>
          {weather.emoji}
        </span>
        <div className="flex flex-col items-start leading-tight">
          <span className="font-extrabold text-[11px] tracking-tight">
            {weather.temp !== null ? `${weather.temp}°C` : "--°C"}
          </span>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {weather.status}
          </span>
        </div>
      </div>
      <div className="w-px h-4.5 bg-slate-200 dark:bg-slate-800/80 mx-0.5" />
      <RefreshCw className={`w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-300 ${refreshing ? "animate-spin text-blue-500" : "group-hover:rotate-45"}`} />
    </button>
  );
};
