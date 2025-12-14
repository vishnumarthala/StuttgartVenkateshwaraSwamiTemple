import { Milestone } from '@/lib/types';

interface ProgressTimelineProps {
  milestones: Milestone[];
}

const statusText = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  upcoming: 'Upcoming',
};

export default function ProgressTimeline({ milestones }: ProgressTimelineProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-br from-stone-50 via-orange-50/50 to-amber-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-temple-gold/10 to-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-temple-dark-red/10 to-rose-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-temple-gold bg-temple-gold/10 rounded-full mb-4">
            Milestones
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-temple-dark-red via-rose-700 to-temple-dark-red bg-clip-text text-transparent">
            Our Sacred Journey
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Follow our progress from vision to reality as we build Lord
            Venkateshwara&apos;s temple in Stuttgart.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Line - Gradient */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-temple-gold via-temple-dark-red to-stone-300 transform md:-translate-x-1/2 rounded-full" />

            {/* Timeline Items */}
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`relative flex items-start mb-12 md:mb-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Content Card */}
                <div
                  className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'
                    }`}
                >
                  <div
                    className={`group relative p-6 md:p-8 rounded-2xl bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl shadow-stone-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-temple-gold/20 hover:-translate-y-1 ${index % 2 === 0 ? 'md:rounded-r-none md:border-r-4' : 'md:rounded-l-none md:border-l-4'
                      } ${milestone.status === 'completed'
                        ? 'border-r-emerald-500 border-l-emerald-500'
                        : milestone.status === 'in-progress'
                          ? 'border-r-temple-gold border-l-temple-gold'
                          : 'border-r-stone-300 border-l-stone-300'
                      }`}
                  >
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full mb-4 ${milestone.status === 'completed'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-200'
                          : milestone.status === 'in-progress'
                            ? 'bg-gradient-to-r from-temple-gold to-amber-500 text-white shadow-md shadow-amber-200 animate-pulse'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                    >
                      {milestone.status === 'completed' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {milestone.status === 'in-progress' && (
                        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                      )}
                      {statusText[milestone.status]}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-800 mb-3 group-hover:text-temple-dark-red transition-colors duration-300">
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-4">
                      {milestone.description}
                    </p>

                    {/* Date */}
                    <p className="text-xs font-semibold tracking-wide text-temple-gold uppercase">
                      {new Date(milestone.date).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Dot / Node */}
                <div className="absolute left-5 md:left-1/2 transform md:-translate-x-1/2 top-6">
                  <div
                    className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 ${milestone.status === 'completed'
                        ? 'bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-300/50'
                        : milestone.status === 'in-progress'
                          ? 'bg-gradient-to-br from-temple-gold to-amber-500 shadow-lg shadow-amber-300/50'
                          : 'bg-gradient-to-br from-stone-300 to-stone-400 shadow-lg shadow-stone-300/50'
                      }`}
                  >
                    {/* Pulsing Ring for In-Progress */}
                    {milestone.status === 'in-progress' && (
                      <span className="absolute inset-0 rounded-full bg-temple-gold/50 animate-ping" />
                    )}

                    {/* Icon */}
                    {milestone.status === 'completed' ? (
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : milestone.status === 'in-progress' ? (
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
