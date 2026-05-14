import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
}

export default function GameCard({ title, description, href, image, imageAlt }: GameCardProps) {
  return (
    <Link href={href} className="card" aria-label={`View ${title}`}>
      <div className="card-image-wrapper">
        <img src={image} alt={imageAlt} className="card-image" />
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
}
