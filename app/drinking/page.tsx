import Link from 'next/link';

export default function DrinkingPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Drinking</h1>
        <p>Score tracking for Drinking is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/drinking.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Drinking
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
