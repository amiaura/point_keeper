import PlaceholderBanner from '../../components/PlaceholderBanner';

export default function SpadesPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Spades</h1>
        <p>Track bids, tricks, bags, and team totals for Spades matches.</p>
        <ul>
          <li>Record bid and trick counts per player or team</li>
          <li>Track overtricks, bags, and penalties</li>
          <li>Support future score summaries and game persistence</li>
        </ul>
        <PlaceholderBanner />
      </section>
    </main>
  );
}
