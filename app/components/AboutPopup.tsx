import React from 'react';

interface AboutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutPopup({ isOpen, onClose }: AboutPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 transform transition-all">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">About MC-Translate</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            MC-TranslateはMinecraftの.lang,.jsonファイルを簡単に翻訳できるようにするアプリです。
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MC-Translate App
          </p>
        </div>
      </div>
    </div>
  );
}