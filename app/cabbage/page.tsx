import PlaceholderBanner from '../../components/PlaceholderBanner';

export default function CabbagePage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Cabbage</h1>
        <p>Prepare to track round totals, running score, and how each player is progressing in cabbage.</p>
        <ul>
          <li>Round-by-round score tracking</li>
          <li>Player totals and running overall score</li>
          <li>Future support for player names and score reset</li>
        </ul>
        <PlaceholderBanner />
      </section>
    </main>
  );
}
