'use client';

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export function GalleryPage({ onTripleClick }: { onTripleClick: () => void }) {
  const images = useQuery(api.images.listImages);
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo((prev) => !prev);

  const handleTripleClick = (() => {
    let clickCount = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    return () => {
      clickCount++;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (clickCount = 0), 500);

      if (clickCount === 3) {
        onTripleClick();
      }
    };
  })();

  if (images === undefined) {
    return (
      <div className="w-screen min-h-screen bg-[#02142b] text-[#f5f5dc] font-mono px-4 py-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f5f5dc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02142b] text-[#f5f5dc] font-mono px-4 py-10 relative">
      {/* INFO TEXT FIXED IN TOP-LEFT */}
      <div onClick={toggleInfo} className="infotext fixed top-4 left-4 cursor-pointer z-20">
        info
      </div>

      {/* INFO POPUP */}
      {showInfo && (
        <div className="info-popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
          <div className="info-content bg-white text-black p-6 rounded-md max-w-md w-full relative">
            <button className="absolute top-2 right-3 text-2xl" onClick={toggleInfo}>
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">About Luca</h2>
            <p>
              Luca is capturing the beauty of the night sky —
              from galaxies and nebulae to constellations. This gallery celebrates his love for space.
            </p>
          </div>
        </div>
      )}

      {/* ALWAYS VISIBLE LOGO + TITLE */}
      <div className="flex flex-col items-center mb-12">
        <img
          src="/logo.png"
          alt="Luca's Stars Logo"
          className="logo-img mb-4 cursor-pointer"
          onClick={handleTripleClick}
        />
        <h1 className="text-5xl font-bold text-center">Luca's Stars</h1>
        <h2 className="scroll mt-10 text-xl text-[#f5f5dc] text-center float-up-down">
          ↓ Scroll to Gallery ↓
        </h2>
      </div>

      {/* GALLERY OR EMPTY MESSAGE */}
      {images.length === 0 ? (
        <p className="text-center text-[#f5f5dc]/70">No images in the gallery yet.</p>
      ) : (
        <div className="gallery-columns">
          {images.map((image) => (
            image.url && (
              <div key={image._id} className="gallery-item">
                <img src={image.url} alt={image.name} className="gallery-img" />
                <h3 className="gallery-title">{image.name}</h3>
                <p className="gallery-desc">{image.description}</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
