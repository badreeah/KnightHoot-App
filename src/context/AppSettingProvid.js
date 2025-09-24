// src/context/AppSettingProvid.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { I18nManager, Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../i18n"; 
import i18n from "i18next";
import { lightTheme, darkTheme } from "../theme/themes";

const STORAGE_KEY = "app_settings_v1";
const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [themeMode, setThemeMode] = useState("system");
  const [language, setLanguage] = useState("en");
  const [systemColorScheme, setSystemColorScheme] = useState(Appearance.getColorScheme() || "light");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.themeMode) setThemeMode(saved.themeMode);
          if (saved.language) setLanguage(saved.language);
        }
      } catch {
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ themeMode, language })).catch(() => {});
  }, [themeMode, language]);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme || "light");
    });
    return () => sub && sub.remove();
  }, []);

  useEffect(() => {
    const isArabic = language === "ar";
    i18n.changeLanguage(language);
  }, [language]);

  const resolvedMode = themeMode === "system" ? systemColorScheme : themeMode;
  const theme = resolvedMode === "dark" ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({
      themeMode,
      language,
      theme,
      isRTL: language === "ar",
      setThemeMode, // "light" | "dark" | "system"
      setLanguage,  // "en" | "ar"
    }),
    [themeMode, language, theme]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export const useAppSettings = () => useContext(AppSettingsContext);
