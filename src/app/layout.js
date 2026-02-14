import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Markz Digital — Coming Soon",
  description:
    "Markz Digital is a full-service digital marketing agency. We're launching soon — subscribe to get notified!",
  keywords: ["marketing agency", "digital marketing", "coming soon", "Markz Digital"],
  openGraph: {
    title: "Markz Digital — Coming Soon",
    description: "We're launching soon — subscribe to get notified!",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
