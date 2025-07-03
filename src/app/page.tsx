import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen mx-0! bg-gradient-to-br from-amber-50 via-white to-amber-100 flex flex-col">

      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-700 mb-6 leading-tight">
            DropZone:{" "}
            <span className="text-amber-500">Track</span> &{" "}
            <span className="text-amber-500">Remember</span> Every Dropoff
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-xl">
            DropZone helps you log, visualize, and manage all your package
            dropoff locations. Whether you’re a courier, a business, or just want
            to remember where you left something, DropZone makes it effortless.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-lg bg-amber-500 text-white font-bold text-lg shadow-lg hover:bg-amber-600 transition"
          >
            Get Started Free
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/landing.jpg"
            alt="Map illustration"
            width={1577}
            height={860}
            className="drop-shadow-xl rounded-xl border border-amber-100"
            priority
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-amber-700 mb-10">
          Why DropZone?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center text-center">
            <svg 
            className="w-13 h-13 text-amber-400 mb-4"
            fill="currentColor"
            strokeWidth={2}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 17H18V14H20V17H23V19H20V22H18V19H15V17M9 6.5C10.4 6.5 11.5 7.6 11.5 9S10.4 11.5 9 11.5 6.5 10.4 6.5 9 7.6 6.5 9 6.5M9 2C12.9 2 16 5.1 16 9C16 14.2 9 22 9 22S2 14.2 2 9C2 5.1 5.1 2 9 2M9 4C6.2 4 4 6.2 4 9C4 10 4 12 9 18.7C14 12 14 10 14 9C14 6.2 11.8 4 9 4Z" /></svg>
            <h3 className="font-semibold text-lg mb-2">Map Your Drops</h3>
            <p className="text-gray-600">
              Visualize every dropoff on an interactive map. Never forget a
              location again.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center text-center">
            <svg
              className="w-12 h-12 text-amber-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <h3 className="font-semibold text-lg mb-2">Stay Organized</h3>
            <p className="text-gray-600">
              Add timestamps and details to each dropoff for easy
              tracking and reporting.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center text-center">
            <svg
              className="w-12 h-12 text-amber-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="font-semibold text-lg mb-2">Simple & Secure</h3>
            <p className="text-gray-600">
              Your data is private and secure. Only you can access your dropoff
              history.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-amber-600 py-12 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            Ready to remember every drop?
          </h2>
          <p className="text-white text-lg mb-6 text-center">
            Sign up now and start tracking your dropoffs in seconds.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-lg bg-white text-amber-600 font-bold text-lg shadow-lg hover:bg-amber-100 transition"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      <footer className="text-center text-gray-400 text-sm py-8">
        &copy; 2025 DropZone &mdash; All rights reserved.
      </footer>
    </main>
  );
}
