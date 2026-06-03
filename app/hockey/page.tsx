import Link from 'next/link';

export default function HockeyPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Hockey</h1>
        <p>Score tracking for Hockey is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/hockey.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Hockey
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
