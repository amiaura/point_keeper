import Link from 'next/link';

export default function TonkPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Tonk</h1>
        <p>Score tracking for Tonk is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/tonk.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Tonk
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
