import { ProjectUpdate } from '@/lib/types';
import UpdateCard from './UpdateCard';

interface UpdateListProps {
  updates: ProjectUpdate[];
}

export default function UpdateList({ updates }: UpdateListProps) {
  if (updates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-temple-dark-gray">No updates yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {updates.map((update) => (
        <UpdateCard key={update.slug} update={update} />
      ))}
    </div>
  );
}
