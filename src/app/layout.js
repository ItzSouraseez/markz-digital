import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Markz Digital — Premium Digital Growth Agency",
  description:
    "Markz Digital combines high-performance growth strategy with elite creative direction to drive measurable, scalable results for category-leading brands.",
  keywords: [
    "digital marketing agency",
    "growth strategy",
    "performance marketing",
    "brand identity",
    "SEO architecture",
    "content direction",
    "Markz Digital",
  ],
  openGraph: {
    title: "Markz Digital — Premium Digital Growth Agency",
    description:
      "Elevate your brand with precision marketing. High-performance growth strategy and elite creative direction.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
