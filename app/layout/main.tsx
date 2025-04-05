import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="app-container h-screen flex flex-col">
      <header className="bg-gray-100 dark:bg-gray-900 text-white py-3 px-4">
        <nav className="container mx-auto flex gap-4">
          <a href="/" className="hover:underline text-gray-900 dark:text-gray-100">Home</a>
        </nav>
      </header>

      <main className="container mx-auto p-4 flex-grow flex flex-col overflow-hidden">
        <Outlet />
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-2 text-center w-full">
        <p className="text-gray-900 dark:text-gray-100 text-sm">© 2025 MC-Translate</p>
      </footer>
    </div>
  );
}