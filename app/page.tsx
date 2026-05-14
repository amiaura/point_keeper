import GameCard from '../components/GameCard';

const games = [
  {
    title: 'Cabbage',
    description: 'Track rounds, running totals, and player progress for cabbage games.',
    href: '/cabbage',
    image: 'https://placehold.co/400x250/eff6ff/0f172a?text=Cabbage',
    imageAlt: 'Cabbage scorecard illustration',
  },
  {
    title: 'Rummy',
    description: 'Prepare for meld scoring, discard totals, and hand results.',
    href: '/rummy',
    image: 'https://placehold.co/400x250/ede9fe/4c1d95?text=Rummy',
    imageAlt: 'Rummy cards illustration',
  },
  {
    title: 'Golf',
    description: 'Manage hole-by-hole scoring and round totals for golf card play.',
    href: '/golf',
    image: 'https://placehold.co/400x250/dcfce7/166534?text=Golf',
    imageAlt: 'Golf card game illustration',
  },
  {
    title: 'Gin',
    description: 'Plan for knock/gins, deadwood, and game-ending scores.',
    href: '/gin',
    image: 'https://placehold.co/400x250/fee2e2/991b1b?text=Gin',
    imageAlt: 'Gin rummy illustration',
  },
  {
    title: 'Hearts',
    description: 'Track trick points, queen captures, and shooting the moon.',
    href: '/hearts',
    image: 'https://placehold.co/400x250/fef3c7/92400e?text=Hearts',
    imageAlt: 'Hearts card game illustration',
  },
  {
    title: 'Spades',
    description: 'Track bids, tricks, bags, and team scoring in spades.',
    href: '/spades',
    image: 'https://placehold.co/400x250/e2e8f0/0f172a?text=Spades',
    imageAlt: 'Spades card game illustration',
  },
];

export default function HomePage() {
  return (
    <main className="page-container">
      <section className="hero">
        <div>
          <p className="eyebrow">Point Keeper</p>
          <h1>A browser-first score tracker for card game nights</h1>
          <p className="lead">
            Use this site to keep track of points and progress for your favorite card games.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Card games</h2>
        <p>Select a game to open its dedicated scoring page.</p>
        <div className="game-grid">
          {games.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              href={game.href}
              image={game.image}
              imageAlt={game.imageAlt}
            />
          ))}
        </div>
      </section>

    </main>
  );
}
