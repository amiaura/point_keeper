import PlaceholderBanner from '../../components/PlaceholderBanner';

export default function GolfPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Golf</h1>
        <p>Track hole-by-hole scoring and round totals for golf-style card games.</p>
        <ul>
          <li>Record score per hole or hand</li>
          <li>Track overall round totals</li>
          <li>Support game summaries and player comparison</li>
        </ul>
        <PlaceholderBanner />
      </section>
    </main>
  );
}
