import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">

      <h1 className="text-2xl font-bold text-white mb-3">My Projects</h1>
      <p className="text-slate-400 mb-8">Track your active and completed projects here. Convert a lead to create your first project.</p>
      <Link href="/dashboard/leads" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
        Browse Leads →
      </Link>
    </div>
  );
}
