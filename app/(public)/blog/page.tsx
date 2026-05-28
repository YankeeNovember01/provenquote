import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — ProvenQuote.ai',
  description: 'Insights, strategies, and case studies for home service business owners looking to grow with exclusive local leads.',
};

const POSTS = [
  {
    slug: 'how-exclusive-leads-changed-our-roofing-business',
    title: 'How Exclusive Lead Generation Changed Our Roofing Business',
    excerpt:
      'After years of sharing leads with 4 other roofers on HomeAdvisor, we made the switch to exclusive leads. Here\'s what happened to our close rate, revenue, and sanity.',
    date: 'May 14, 2026',
    readTime: '6 min read',
    category: 'Case Study',
    categoryColor: '#10B981',
  },
  {
    slug: 'homeadvisor-vs-provenquote-real-difference',
    title: 'HomeAdvisor vs ProvenQuote: The Real Difference for Contractors',
    excerpt:
      'We break down exactly how shared lead platforms work, why your close rate is suffering, and what switching to exclusive leads actually costs (and returns).',
    date: 'May 7, 2026',
    readTime: '8 min read',
    category: 'Comparison',
    categoryColor: '#2563EB',
  },
  {
    slug: 'how-to-win-more-bids-home-service-guide',
    title: 'How to Win More Bids: A Guide for Home Service Businesses',
    excerpt:
      'Speed-to-call, pricing psychology, follow-up sequences — the tactics top contractors use to close more jobs from the same number of leads.',
    date: 'April 29, 2026',
    readTime: '10 min read',
    category: 'Strategy',
    categoryColor: '#F59E0B',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Strategies, case studies, and insights for home service businesses.
        </p>
      </div>

      <div className="space-y-8">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${post.categoryColor}22`, color: post.categoryColor }}
              >
                {post.category}
              </span>
              <span className="text-xs text-slate-500">{post.date}</span>
              <span className="text-xs text-slate-600">·</span>
              <span className="text-xs text-slate-500">{post.readTime}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#2563EB] transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">{post.excerpt}</p>
            <p className="text-[#2563EB] text-sm font-medium mt-4">Read article →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
