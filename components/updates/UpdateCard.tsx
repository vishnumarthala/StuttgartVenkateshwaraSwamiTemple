import Link from 'next/link';
import Image from 'next/image';
import { ProjectUpdate } from '@/lib/types';
import { formatDate } from '@/lib/content';

interface UpdateCardProps {
  update: ProjectUpdate;
}

export default function UpdateCard({ update }: UpdateCardProps) {
  return (
    <article className="card overflow-hidden group">
      <Link href={`/updates/${update.slug}`} className="block">
        {/* Image */}
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-gray-200">
          <Image
            src={update.image}
            alt={update.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <time className="text-sm text-gray-500">{formatDate(update.publishedAt)}</time>
        <h2 className="text-xl font-serif text-temple-dark-red mt-1 mb-2 group-hover:text-temple-maroon transition-colors">
          {update.title}
        </h2>
        <p className="text-temple-dark-gray text-sm line-clamp-3">{update.excerpt}</p>

        {/* Read More */}
        <span className="inline-flex items-center mt-4 text-temple-maroon font-medium text-sm group-hover:underline">
          Read More
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </Link>
    </article>
  );
}
