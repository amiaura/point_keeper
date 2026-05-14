import PlaceholderBanner from '../../components/PlaceholderBanner';

export default function HeartsPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Hearts</h1>
        <p>Track trick points, queen captures, and shooting the moon for Hearts games.</p>
        <ul>
          <li>Monitor point totals per round</li>
          <li>Track queen of spades and heart tricks</li>
          <li>Plan for shoot-the-moon scenarios and score persistence</li>
        </ul>
        <PlaceholderBanner />
      </section>
    </main>
  );
}
