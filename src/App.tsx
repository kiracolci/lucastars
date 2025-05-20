'use client';

import { useState } from "react";
import { Toaster } from "sonner";
import { AdminPage } from "./AdminPage";
import { GalleryPage } from "./GalleryPage";

export default function App() {
  const [currentView, setCurrentView] = useState<"gallery" | "admin">("gallery");

  return (
    <div className="min-h-screen flex flex-col bg-[#02142b]">
      <header className="sticky top-0 z-20 bg-[#02142b] backdrop-blur-md shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h2
            className="text-2xl font-bold accent-text cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setCurrentView("gallery")}
            title="Back to Gallery"
          >
            
          </h2>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView("admin")}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              title="Access Admin Area"
            >
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        {currentView === "gallery" ? (
          <GalleryPage onTripleClick={() => setCurrentView("admin")} />
        ) : (
          <AdminPage onReturn={() => setCurrentView("gallery")} />
        )}
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
