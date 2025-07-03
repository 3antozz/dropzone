export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white py-4 px-6 mt-8">
            <div className="max-w-7xl mx-auto! px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-sm text-gray-500">
                    © Yacine Belahadji 2025
                </span>
                <nav className="flex gap-4">
                    <a
                        href="https://github.com/3antozz/dropzone"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-amber-600 transition"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://yacinedev.com/contact"
                        className="text-gray-400 hover:text-amber-600 transition"
                    >
                        Contact
                    </a>
                </nav>
            </div>
        </footer>
    );
}
