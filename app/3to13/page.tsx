import Link from 'next/link';

export default function ThreeToThirteenPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>3 to 13</h1>
        <p>Score tracking for 3 to 13 is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/3to13.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for 3 to 13
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
