import GameCard from '../components/GameCard';

const basePath = '/point_keeper';

const games = [
  {
    title: '3 to 13',
    description: 'Track the classic 3 to 13 card game in one place.',
    href: '/3to13',
    instructionsHref: `${basePath}/instructions/3to13.pdf`,
    image: `${basePath}/images/3to13.jpg`,
    imageAlt: '3 to 13 card game illustration',
  },
  {
    title: 'Cabbage',
    description: 'Track rounds, running totals, and player progress for cabbage games.',
    href: '/cabbage',
    instructionsHref: `${basePath}/instructions/cabbage.pdf`,
    image: `${basePath}/images/cabbage.jpg`,
    imageAlt: 'Cabbage scorecard illustration',
  },
  {
    title: 'Drinking',
    description: 'Reference game instructions for drinking without score tracking.',
    instructionsHref: `${basePath}/instructions/drinking.pdf`,
    image: `${basePath}/images/drinking.jpg`,
    imageAlt: 'Drinking game illustration',
  },
  {
    title: 'Euchre',
    description: 'Track trump, tricks, and partner scoring for euchre.',
    href: '/euchre',
    instructionsHref: `${basePath}/instructions/euchre.pdf`,
    image: `${basePath}/images/euchre.jpg`,
    imageAlt: 'Euchre cards illustration',
  },
  {
    title: 'Garbage',
    description: 'Reference game instructions for garbage without score tracking.',
    instructionsHref: `${basePath}/instructions/garbage.pdf`,
    image: `${basePath}/images/garbage.jpg`,
    imageAlt: 'Garbage card game illustration',
  },
  {
    title: 'Gin',
    description: 'Plan for knock/gins, deadwood, and game-ending scores.',
    href: '/gin',
    instructionsHref: `${basePath}/instructions/gin.pdf`,
    image: `${basePath}/images/gin.jpg`,
    imageAlt: 'Gin rummy illustration',
  },
  {
    title: 'Golf',
    description: 'Manage hole-by-hole scoring and round totals for golf card play.',
    href: '/golf',
    instructionsHref: `${basePath}/instructions/golf.pdf`,
    image: `${basePath}/images/golf.jpg`,
    imageAlt: 'Golf card game illustration',
  },
  {
    title: 'Hearts',
    description: 'Track trick points, queen captures, and shooting the moon.',
    href: '/hearts',
    instructionsHref: `${basePath}/instructions/hearts.pdf`,
    image: `${basePath}/images/hearts.jpg`,
    imageAlt: 'Hearts card game illustration',
  },
  {
    title: 'Hockey',
    description: 'Track scoring and penalties for hockey card play.',
    href: '/hockey',
    instructionsHref: `${basePath}/instructions/hockey.pdf`,
    image: `${basePath}/images/hockey.jpg`,
    imageAlt: 'Hockey card game illustration',
  },
  {
    title: 'Mao',
    description: 'Reference game instructions for Mao without score tracking.',
    instructionsHref: `${basePath}/instructions/mao.pdf`,
    image: `${basePath}/images/mao.jpg`,
    imageAlt: 'Mao card game illustration',
  },
  {
    title: 'Rummy',
    description: 'Prepare for meld scoring, discard totals, and hand results.',
    href: '/rummy',
    instructionsHref: `${basePath}/instructions/rummy.pdf`,
    image: `${basePath}/images/rummy.JPG`,
    imageAlt: 'Rummy cards illustration',
  },
  {
    title: 'Spades',
    description: 'Track bids, tricks, bags, and team scoring in spades.',
    href: '/spades',
    instructionsHref: `${basePath}/instructions/spades.pdf`,
    image: `${basePath}/images/spades.jpg`,
    imageAlt: 'Spades card game illustration',
  },
  {
    title: 'Speed',
    description: 'Reference game instructions for Speed without score tracking.',
    instructionsHref: `${basePath}/instructions/speed.pdf`,
    image: `${basePath}/images/speed.jpg`,
    imageAlt: 'Speed card game illustration',
  },
  {
    title: 'Tonk',
    description: 'Track hands and knockout scoring for Tonk.',
    href: '/tonk',
    instructionsHref: `${basePath}/instructions/tonk.pdf`,
    image: `${basePath}/images/tonk.jpg`,
    imageAlt: 'Tonk card game illustration',
  },
];

const nonPointGames = ['Drinking', 'Mao', 'Garbage', 'Speed'];
const scoringGames = games.filter((game) => !nonPointGames.includes(game.title));
const nonScoringGames = games.filter((game) => nonPointGames.includes(game.title));

export default function HomePage() {
  return (
    <main className="page-container">
      <section className="hero">
        <div>
          <p className="eyebrow">Point Keeper</p>
          <h1>Game Night Score Keeper</h1>
          <p className="lead">
            Use this site to keep track of points and progress for your favorite card games.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Card games</h2>
        <p>Select a game to open its dedicated scoring page.</p>
        <div className="game-grid">
          {scoringGames.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              href={game.href}
              instructionsHref={game.instructionsHref}
              image={game.image}
              imageAlt={game.imageAlt}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Games without point keeping</h2>
        <p>These games are included as reference and instruction guides rather than active score tracking.</p>
        <div className="game-grid">
          {nonScoringGames.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              href={game.href}
              instructionsHref={game.instructionsHref}
              image={game.image}
              imageAlt={game.imageAlt}
            />
          ))}
        </div>
      </section>

    </main>
  );
}
