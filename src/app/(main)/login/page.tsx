import Form from "@/components/forms/login";
import Link from "next/link";
export default function Login() {
  return (
    <main className="min-h-[60vh] flex flex-col gap-4 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-amber-600 mb-6 text-center">Login</h1>
        <Form />
      </div>
      <p>Don&apos;t have an account ? <Link className="text-amber-600 hover:underline" href={'/register'}>Sign-up here.</Link></p>
    </main>
  );
}
