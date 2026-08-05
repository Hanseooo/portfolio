import { Inter, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-display",
  display: "swap",
});

/** Combined CSS variable class string for <html> */
export const fontVariableClasses = `${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable}`;
