import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'View photos and images from Sri Venkateshwara Temple Stuttgart project progress.',
};

// Gallery images - using swami.jpg as the main image for now
const galleryImages = [
  {
    id: '1',
    src: '/images/swami.jpg',
    alt: 'Lord Venkateshwara',
    category: 'Divine',
  },
];

export default function GalleryPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-temple-dark-red mb-4">
            Gallery
          </h1>
          <p className="text-lg text-temple-dark-gray">
            Visual journey of our temple project — from planning to progress.
          </p>
        </div>

        {/* Featured Image */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/images/swami.jpg"
              alt="Lord Venkateshwara"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-center mt-4 text-temple-dark-gray font-serif text-lg">
            Lord Sri Venkateshwara
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center bg-temple-cream rounded-xl p-8">
          <h2 className="text-2xl font-serif text-temple-dark-red mb-4">
            More Photos Coming Soon
          </h2>
          <p className="text-temple-dark-gray max-w-xl mx-auto">
            As our temple construction progresses, we will share photos of the site,
            community events, and construction milestones. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
