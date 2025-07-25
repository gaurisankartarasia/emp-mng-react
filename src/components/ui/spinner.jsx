import React from 'react';

export const Spinner = ({ size = 40, color = 'var(--primary)' }) => {
  const thickness = Math.round(size * 0.16);

  return (
    <>
      <div
        className="loader"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          '--b': `${thickness}px`,
          '--spinner-color': color,
        }}
      ></div>

      <style>{`
        .loader {
          aspect-ratio: 1;
          border-radius: 50%;
          padding: 1px;
          background: conic-gradient(#0000 10%, var(--spinner-color)) content-box;
          -webkit-mask:
            repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
            radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
          -webkit-mask-composite: destination-in;
          mask-composite: intersect;
          animation: l4 1s infinite steps(10);
        }

        @keyframes l4 {
          to {
            transform: rotate(1turn);
          }
        }
      `}</style>
    </>
  );
};

