import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUpdateBySlug, getUpdateSlugs, formatDate } from '@/lib/content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getUpdateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);

  if (!update) {
    return { title: 'Update Not Found' };
  }

  return {
    title: update.title,
    description: update.excerpt,
  };
}

export default async function UpdatePage({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);

  if (!update) {
    notFound();
  }

  return (
    <article className="py-12 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/updates"
            className="inline-flex items-center text-temple-maroon hover:underline mb-8"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Updates
          </Link>

          {/* Header */}
          <header className="mb-8">
            <time className="text-sm text-gray-500">
              {formatDate(update.publishedAt)}
            </time>
            <h1 className="text-3xl md:text-4xl font-serif text-temple-dark-red mt-2">
              {update.title}
            </h1>
          </header>

          {/* Featured Image */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-gray-200">
            <Image
              src={update.image}
              alt={update.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-temple-dark-gray"
              dangerouslySetInnerHTML={{ __html: update.content }}
            />
          </div>

          {/* Share / CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                Support Our Mission
              </h2>
              <p className="text-temple-dark-gray mb-6">
                Your contribution helps make this temple a reality.
              </p>
              <Link href="/donate" className="btn-primary">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
