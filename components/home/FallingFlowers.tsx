'use client';

import Image from 'next/image';

interface FlowerProps {
  id: number;
  side: 'left' | 'right';
  size: number;
  left: number;
  delay: number;
  duration: number;
  startTop: number;
  opacity: number;
}

// Generate deterministic but varied flower configurations
const generateFlowers = (): FlowerProps[] => {
  const flowers: FlowerProps[] = [];
  
  // Left side flowers (8-10 flowers)
  const leftPositions = [3, 6, 10, 14, 5, 12, 8, 16, 4, 11];
  const leftDelays = [0, 2.5, 5, 1.2, 7, 3.8, 6.2, 0.8, 4.5, 8.5];
  const leftSizes = [32, 28, 36, 24, 30, 26, 34, 28, 32, 24];
  const leftDurations = [10, 12, 9, 14, 11, 13, 10, 12, 11, 9];
  const leftStartTops = [-5, -12, -8, -15, -3, -10, -18, -6, -14, -9];
  const leftOpacities = [0.9, 0.7, 0.85, 0.75, 0.95, 0.8, 0.7, 0.9, 0.85, 0.75];
  
  for (let i = 0; i < 10; i++) {
    flowers.push({
      id: i,
      side: 'left',
      size: leftSizes[i],
      left: leftPositions[i],
      delay: leftDelays[i],
      duration: leftDurations[i],
      startTop: leftStartTops[i],
      opacity: leftOpacities[i],
    });
  }
  
  // Right side flowers (8-10 flowers)
  const rightPositions = [84, 88, 92, 96, 86, 90, 94, 82, 89, 95];
  const rightDelays = [1.5, 4, 0.5, 6.5, 2.8, 5.5, 8, 3.2, 7.5, 1];
  const rightSizes = [30, 34, 26, 32, 28, 36, 24, 30, 32, 28];
  const rightDurations = [11, 9, 13, 10, 12, 8, 14, 11, 10, 12];
  const rightStartTops = [-8, -4, -16, -10, -6, -13, -2, -11, -7, -15];
  const rightOpacities = [0.85, 0.9, 0.75, 0.8, 0.95, 0.7, 0.85, 0.9, 0.75, 0.8];
  
  for (let i = 0; i < 10; i++) {
    flowers.push({
      id: i + 10,
      side: 'right',
      size: rightSizes[i],
      left: rightPositions[i],
      delay: rightDelays[i],
      duration: rightDurations[i],
      startTop: rightStartTops[i],
      opacity: rightOpacities[i],
    });
  }
  
  return flowers;
};

const flowers = generateFlowers();

export default function FallingFlowers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute"
          style={{
            left: `${flower.left}%`,
            top: `${flower.startTop}%`,
            width: flower.size,
            height: flower.size,
            opacity: flower.opacity,
            animation: `flower-fall-${flower.side} ${flower.duration}s ease-in-out infinite`,
            animationDelay: `${flower.delay}s`,
          }}
        >
          <Image
            src="/images/flower.png"
            alt=""
            width={flower.size}
            height={flower.size}
            className="w-full h-full object-contain drop-shadow-lg"
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}
