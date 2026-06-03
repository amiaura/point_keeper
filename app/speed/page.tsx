import Link from 'next/link';

export default function SpeedPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Speed</h1>
        <p>Score tracking for Speed is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/speed.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Speed
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
