import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'DentaMaroc - Logiciel de Gestion pour Cabinet Dentaire & Labo Prothèse',
  description:
    'Application web moderne et complète pour chirurgiens-dentistes et prothésistes dentaires au Maroc. Odontogramme FDI, Agenda, Devis/Factures mutuelle (CNOPS/CNSS/AMO), et Suivi Prothèse.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦷</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased selection:bg-sky-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
