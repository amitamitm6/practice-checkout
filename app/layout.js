import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://video-checkout.vercel.app"),
  title: "My Store — Checkout",
  description: "Practice checkout page",
  openGraph: {
    title: "My Store — Checkout",
    description: "Practice checkout page",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
