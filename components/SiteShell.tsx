import type { ReactNode } from 'react';

interface SiteShellProps {
  children: ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div>
      {children}
      <footer className="footer">
        <p>Point Keeper is a browser-side score tracker for card games.</p>
      </footer>
    </div>
  );
}
