import { COLORS } from "../../util/colors";

const base = {
  spacing: (n=1) => 8*n,
  radius: 16,
  fonts: {
    regular: "Poppins-400",
    medium: "Poppins-500",
    semibold: "Poppins-600",
    bold: "Poppins-700",
  },
  badges: {
    safe: COLORS.brightTiffany,
    warn: COLORS.purple2,
    danger: COLORS.purple7,
  }
};

export const lightTheme = {
  ...base,
  mode: "light",
  colors: {
    background: "#F9FAFB",
    card: "#FFFFFF",
    cardBorder: "#E5E7EB",
    text: COLORS.purple8,
    subtext: "#797A7A",
    primary: COLORS.brightTiffany, // أزرار رئيسية
    primaryTextOn: "#FFFFFF",
    outline: COLORS.gray1,
    tint: COLORS.purple1,
  },
  statusbar: { barStyle: "dark-content", backgroundColor: "#F9FAFB" },
};

export const darkTheme = {
  ...base,
  mode: "dark",
  colors: {
    background: "#070809df",
    card: "#141821c8",
    cardBorder: "#202638",
    text: "#E7E9EE",
    subtext: "#AEB3C2",
    primary: COLORS.purple3,    
    primaryTextOn: "#FFFFFF",
    outline: "#3A4157",
    tint: COLORS.purple2,
  },
  statusbar: { barStyle: "light-content", backgroundColor: "#0F1115" },
};
