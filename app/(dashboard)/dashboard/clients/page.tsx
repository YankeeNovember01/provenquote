import Link from 'next/link';

export default function ClientsPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <p className="text-4xl mb-4">👥</p>
      <h1 className="text-2xl font-bold text-white mb-3">My Clients</h1>
      <p className="text-slate-400 mb-8">Your recurring clients will appear here after you close jobs and mark them as recurring.</p>
      <Link href="/dashboard/leads" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
        Go to Lead Inbox →
      </Link>
    </div>
  );
}
