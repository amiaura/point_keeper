'use client';

import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-inner">
        <Link href="/" className="nav-link" style={{ fontWeight: 700 }}>
          Point Keeper
        </Link>
      </div>
    </nav>
  );
}
