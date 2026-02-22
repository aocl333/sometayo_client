import Image from 'next/image';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showEmpty?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 14,
  showEmpty = true,
  className = '',
}: StarRatingProps) {
  return (
    <div className={`${styles.starRating} ${className}`}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Image
          key={i}
          src="/images/ico_star.svg"
          alt=""
          width={size}
          height={size}
          className={`${styles.star} ${i < rating ? styles.filled : styles.empty}`}
        />
      ))}
    </div>
  );
}
