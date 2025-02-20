'use client';

export default function BackgroundBlob() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Top left blob */}
      <div className="absolute top-[30%] left-0 w-[400px] h-[400px] -translate-x-[45%] -translate-y-[45%] pointer-events-none animate-blob opacity-70">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-candy-pink">
          <path d="M34,-57.4C40.2,-48.9,38.7,-33,42,-20.7C45.3,-8.4,53.4,0.2,58.3,12.8C63.3,25.3,65.2,41.7,58.4,51.6C51.5,61.5,35.7,64.8,22.1,63.6C8.4,62.3,-3.2,56.4,-15.4,52.7C-27.6,49,-40.4,47.5,-47,40.4C-53.5,33.3,-54,20.6,-60.2,6C-66.4,-8.6,-78.4,-24.9,-76.9,-38C-75.5,-51.2,-60.5,-61,-45.4,-65.5C-30.4,-69.9,-15.2,-69,-0.6,-68C13.9,-67,27.8,-65.9,34,-57.4Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      {/* Top right blob */}
      <div className="absolute top-[10%] right-0 w-[300px] h-[300px] translate-x-[45%] -translate-y-[35%] pointer-events-none animate-blob-top-right opacity-50">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-nba-orange">
          <path d="M31.7,-13.9C38.3,10,39,32.3,30,38C21.1,43.7,2.6,32.8,-11.5,21.3C-25.7,9.8,-35.4,-2.4,-32.7,-21C-30.1,-39.5,-15,-64.4,-1.2,-64C12.6,-63.6,25.1,-37.9,31.7,-13.9Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Middle right blob */}
      <div className="absolute top-[50%] right-0 w-[375px] h-[375px] translate-x-[45%] -translate-y-1/2 pointer-events-none animate-blob-right opacity-70">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-candy-pink">
          <path d="M37.1,-39.4C46.8,-27.4,52.6,-13.7,52,-0.6C51.4,12.5,44.5,25,34.7,37.4C25,49.7,12.5,61.9,-4.3,66.1C-21.1,70.4,-42.1,66.8,-50.5,54.5C-58.9,42.1,-54.6,21.1,-53.4,1.2C-52.2,-18.6,-54,-37.3,-45.7,-49.3C-37.3,-61.3,-18.6,-66.6,-2.5,-64.1C13.7,-61.7,27.4,-51.4,37.1,-39.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Middle left blob */}
      <div className="absolute top-[69%] left-0 w-[350px] h-[350px] -translate-x-[45%] -translate-y-1/2 pointer-events-none animate-blob-middle opacity-50">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-nba-orange">
          <path d="M31.5,-35.9C46,-32.8,66.4,-30.5,68.6,-22.6C70.8,-14.6,54.8,-1,46.5,12.2C38.2,25.5,37.7,38.3,31.3,52.5C24.8,66.6,12.4,82.1,-1,83.5C-14.5,84.9,-28.9,72.3,-42.7,60.5C-56.5,48.8,-69.6,37.8,-77.2,23.1C-84.8,8.3,-86.8,-10.3,-80.1,-24.5C-73.3,-38.6,-57.8,-48.4,-43,-51.4C-28.2,-54.4,-14.1,-50.6,-2.8,-46.8C8.5,-42.9,17,-39,31.5,-35.9Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  );
} 