import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  href?: string;
  instructionsHref: string;
  image: string;
  imageAlt: string;
}

export default function GameCard({ title, description, href, instructionsHref, image, imageAlt }: GameCardProps) {
  return (
    <article className="card">
      <div className="card-image-wrapper">
        {href ? (
          <Link href={href} className="card-link-image" aria-label={`View ${title}`}>
            <img src={image} alt={imageAlt} className="card-image" />
          </Link>
        ) : (
          <div className="card-link-image card-image-static">
            <img src={image} alt={imageAlt} className="card-image" />
          </div>
        )}
      </div>
      <div className="card-body">
        {href ? (
          <Link href={href} className="card-link" aria-label={`View ${title}`}>
            <h3>{title}</h3>
            <p>{description}</p>
          </Link>
        ) : (
          <div className="card-text">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        )}
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
