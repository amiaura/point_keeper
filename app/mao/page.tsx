import Link from 'next/link';

export default function MaoPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Mao</h1>
        <p>Score tracking for Mao is coming soon.</p>
        <p>
          <a href="/point_keeper/instructions/mao.pdf" target="_blank" rel="noopener noreferrer">
            Open instructions for Mao
          </a>
        </p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
