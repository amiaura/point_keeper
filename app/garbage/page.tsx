import Link from 'next/link';

export default function GarbagePage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Garbage</h1>
        <p>Score tracking for Garbage is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/garbage.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Garbage
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
