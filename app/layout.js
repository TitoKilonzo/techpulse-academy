import './globals.css';
export const metadata = {
  title: { default: 'TechPulse Academy', template: '%s | TechPulse Academy' },
  description: 'Open-source e-learning platform for Tech, Cybersecurity, AI, Open Source & Cloud Computing.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
