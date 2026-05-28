import { Heart, MessageCircle, Share2, ChefHat, BookOpen, Lightbulb, Award } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store';

const typeIcons = {
  recipe: ChefHat,
  story: BookOpen,
  tips: Lightbulb,
  featured_farmer: Award,
};

const typeColors: Record<string, string> = {
  recipe: '#E74C3C',
  story: '#DAA520',
  tips: '#27AE60',
  featured_farmer: '#8B6914',
};

export default function CommunitySection() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? state.communityPosts
    : state.communityPosts.filter(p => p.type === filter);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'recipe', label: 'Recipes' },
    { key: 'story', label: 'Stories' },
    { key: 'tips', label: 'Tips' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Community</h2>
        <p className="text-sm text-slate-500 mt-1">Recipes, stories, and tips from our farming community.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.key ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-green-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all cursor-pointer"
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'communityPost', data: post } })}
          >
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                {post.authorName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">{post.authorName}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize">{post.authorRole}</span>
                  <span>&middot;</span>
                  <span>{new Date(post.createdDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Image placeholder */}
            <div
              className="h-40 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: (typeColors[post.type] || '#64748b') + '18' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: typeColors[post.type] || '#64748b' }}
              >
                {(() => { const Icon = typeIcons[post.type] || BookOpen; return <Icon className="w-7 h-7 text-white" />; })()}
              </div>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-slate-800 mb-1">{post.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{post.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">#{tag}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5 pt-3 border-t border-slate-50">
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch({ type: 'LIKE_POST', payload: post.id });
                }}
                className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-500 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
