import "./globals.css";

export const metadata = {
  title: "My Store — Checkout",
  description: "Practice checkout page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
