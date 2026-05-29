import Link from 'next/link';

export default function DocumentsPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">

      <h1 className="text-2xl font-bold text-white mb-3">Documents & Claims</h1>
      <p className="text-slate-400 mb-8">Manage insurance claims, project contracts, and important documents here. This feature is coming soon.</p>
      <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
        Back to Dashboard
      </Link>
    </div>
  );
}
