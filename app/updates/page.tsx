import { Metadata } from 'next';
import UpdateList from '@/components/updates/UpdateList';
import { getAllUpdates } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Updates',
  description:
    'Follow the progress of Sri Venkateshwara Temple Stuttgart construction. Latest news and updates from our journey.',
};

export default function UpdatesPage() {
  const updates = getAllUpdates();

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-temple-dark-red mb-4">
            Project Updates
          </h1>
          <p className="text-lg text-temple-dark-gray">
            Follow our journey from vision to reality. Stay updated with the latest
            news about the temple construction.
          </p>
        </div>

        {/* Updates List */}
        <UpdateList updates={updates} />
      </div>
    </div>
  );
}
