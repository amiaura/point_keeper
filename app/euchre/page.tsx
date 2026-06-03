import Link from 'next/link';

export default function EuchrePage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Euchre</h1>
        <p>Score tracking for Euchre is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/euchre.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Euchre
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
