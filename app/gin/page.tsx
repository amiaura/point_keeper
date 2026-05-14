import PlaceholderBanner from '../../components/PlaceholderBanner';

export default function GinPage() {
  return (
    <main className="page-container">
      <section className="section">
        <h1>Gin</h1>
        <p>Prepare to track gin, knock, and deadwood scoring for Gin Rummy rounds.</p>
        <ul>
          <li>Track player deadwood totals and knock scores</li>
          <li>Record gin finishes and bonus values</li>
          <li>Plan for ongoing game totals in the browser</li>
        </ul>
        <PlaceholderBanner />
      </section>
    </main>
  );
}
