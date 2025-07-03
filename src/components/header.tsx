import { signOut, auth } from "../auth";
import Link from "next/link";

export default async function Header() {
    const session = await auth();
    const atIndex = session?.user.email.indexOf("@");
    let username = session?.user.email;
    if(atIndex > -1) {
        username = username.slice(0, atIndex)
    }
    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href={session?.user ? '/dashboard' : '/'}><h1 className="text-3xl font-bold text-amber-600 tracking-tight">DropZone</h1></Link>
            <div className="flex items-center gap-4">
                <nav className="flex gap-8">
                    {session?.user ?
                    <>
                    <Link href="/dashboard" className="text-gray-700 text-lg hover:text-amber-600 font-medium transition">Dashboard</Link>
                    <Link href="/settings" className="text-gray-700 text-lg hover:text-amber-600 font-medium transition">Settings</Link> 
                    </>
                    :
                    <Link href="/" className="text-gray-700 text-lg hover:text-amber-600 font-medium transition">Home</Link>
                    }
                </nav>
            </div>
            <div className="flex items-center gap-4">
                {session?.user && (
                    <span className="text-sm text-gray-400">{username}</span>
                )}
                {session?.user ? (
                    <form
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                    >
                        <button
                            type="submit"
                            className="px-3 py-1 cursor-pointer rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-amber-500 transition"
                        >
                            Sign Out
                        </button>
                    </form>
                ) : (
                    <Link
                        href="/login"
                        className="px-3 py-1 text-lg! rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
