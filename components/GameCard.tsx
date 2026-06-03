import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  instructionsHref: string;
  image: string;
  imageAlt: string;
}

export default function GameCard({ title, description, href, instructionsHref, image, imageAlt }: GameCardProps) {
  return (
    <article className="card">
      <div className="card-image-wrapper">
        <Link href={href} className="card-link-image" aria-label={`View ${title}`}>
          <img src={image} alt={imageAlt} className="card-image" />
        </Link>
      </div>
      <div className="card-body">
        <Link href={href} className="card-link" aria-label={`View ${title}`}>
          <h3>{title}</h3>
          <p>{description}</p>
        </Link>
        <a
          href={instructionsHref}
          className="instructions-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View instructions
        </a>
      </div>
    </article>
  );
}
