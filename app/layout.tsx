import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { GameStateProvider } from '../context/GameStateContext';
import Nav from '../components/Nav';
import SiteShell from '../components/SiteShell';

export const metadata: Metadata = {
  title: 'Point Keeper',
  description: 'A browser-based point counter for your favorite card games.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GameStateProvider>
          <SiteShell>
            <Nav />
            {children}
          </SiteShell>
        </GameStateProvider>
      </body>
    </html>
  );
}
