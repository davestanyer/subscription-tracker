import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Configure your subscription management settings',
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({
  children,
}: SettingsLayoutProps): JSX.Element {
  return (
    <div className="settings-layout">
      {children}
    </div>
  );
}