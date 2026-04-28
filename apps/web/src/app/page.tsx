import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">IELTS Platform</h1>
      <p className="mb-6 text-slate-600">Reading module scaffolding is ready.</p>
      <Link
        href="/reading/tests/reading_test_001/attempt"
        className="inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Open Reading Attempt
      </Link>
    </main>
  );
}
