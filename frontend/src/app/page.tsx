import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold">Welcome to Craftathon</h1>
      <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
        Go to Admin Dashboard
      </Link>
    </div>
  );
}
