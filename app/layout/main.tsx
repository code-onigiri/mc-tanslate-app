import { Outlet } from "react-router";


export default function MainLayout() {
    return(
        <div className="app-container">
            <header className="bg-gray-100 dark:bg-gray-900 text-white p-4">
                <nav className="container mx-auto flex gap-4">
                    <a href="/" className="hover:underline text-gray-900 dark:text-gray-100">Home</a>
                    <a href="/about" className="hover:underline text-gray-900 dark:text-gray-100">About</a>
                </nav>
            </header>

            <main className="container mx-auto p-4">
                <Outlet />
            </main>

            <footer className="bg-gray-100 dark:bg-gray-900 text-white p-4 text-center fixed bottom-0 w-full">
                <p className="text-gray-900 dark:text-gray-100">© 2025 MC-Translate</p>
            </footer>
        </div>
    );
}