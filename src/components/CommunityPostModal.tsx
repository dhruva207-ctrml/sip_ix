import { Heart, MessageCircle, Share2, ChefHat, BookOpen, Lightbulb, Award } from 'lucide-react';
import { useApp } from '../store';
import Modal from './Modal';

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

export default function CommunityPostModal() {
  const { state, dispatch } = useApp();
  const post = state.ui.modalData;

  if (!post) return null;

  const Icon = typeIcons[post.type as keyof typeof typeIcons] || BookOpen;

  return (
    <Modal maxWidth="max-w-lg">
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
            {post.authorName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{post.authorName}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="capitalize">{post.authorRole}</span>
              <span>&middot;</span>
              <span>{new Date(post.createdDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="h-48 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: (typeColors[post.type] || '#64748b') + '18' }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: typeColors[post.type] || '#64748b' }}
          >
            <Icon className="w-9 h-9 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">{post.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.content}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.tags.map((tag: string) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">#{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => dispatch({ type: 'LIKE_POST', payload: post.id })}
            className={`flex items-center gap-2 transition-colors ${post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500' : ''}`} />
            <span className="text-sm font-medium">{post.likes + (post.liked ? 0 : 0)}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
