import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Clients',
  description: 'Manage your client relationships',
};

interface ClientsLayoutProps {
  children: React.ReactNode;
}

export default function ClientsLayout({
  children,
}: ClientsLayoutProps): JSX.Element {
  return (
    <div className="clients-layout">
      {children}
    </div>
  );
}