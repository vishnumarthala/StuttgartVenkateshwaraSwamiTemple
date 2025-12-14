import { Milestone } from '@/lib/types';

interface ProgressTimelineProps {
  milestones: Milestone[];
}

const statusColors = {
  completed: 'bg-green-500',
  'in-progress': 'bg-temple-gold',
  upcoming: 'bg-gray-300',
};

const statusText = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  upcoming: 'Upcoming',
};

export default function ProgressTimeline({ milestones }: ProgressTimelineProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Journey</h2>
          <p className="text-lg text-temple-dark-gray max-w-2xl mx-auto">
            Follow our progress from vision to reality as we build Lord
            Venkateshwara&apos;s temple in Stuttgart.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2" />

            {/* Timeline Items */}
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`relative flex items-start mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}
                >
                  <div className="card">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${
                        milestone.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : milestone.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {statusText[milestone.status]}
                    </span>
                    <h3 className="text-xl font-serif text-temple-dark-red mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-temple-dark-gray text-sm mb-2">
                      {milestone.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(milestone.date).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-0">
                  <div
                    className={`w-8 h-8 rounded-full border-4 border-white ${
                      statusColors[milestone.status]
                    } shadow-md flex items-center justify-center`}
                  >
                    {milestone.status === 'completed' && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
