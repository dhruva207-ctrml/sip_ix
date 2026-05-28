import { MapPin, Plus, Calendar, MessageSquare, ShieldCheck, Minus, Hash } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store';
import Badge from './Badge';
import Modal from './Modal';
import type { Product } from '../types';

export default function ProductDetailModal() {
  const { state, dispatch } = useApp();
  const product: Product = state.ui.modalData;
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const qualityReport = state.qualityReports.find(qr => qr.id === product.qualityReportId);
  const farmer = state.users.find(u => u.id === product.farmerId);

  const daysToHarvest = product.status === 'preorder'
    ? Math.ceil((new Date(product.harvestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity: qty } });
    dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `${product.name} added to cart`, type: 'success' } });
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleMessageFarmer = () => {
    const existingConv = state.conversations.find(c =>
      c.participantIds.includes(state.currentUser.id) && c.participantIds.includes(product.farmerId)
    );
    if (!existingConv) {
      const newConv = {
        id: Math.random().toString(36).substring(2, 10),
        participantIds: [state.currentUser.id, product.farmerId],
        participantNames: [state.currentUser.name, product.farmerName],
        lastMessage: `Hi, I am interested in your ${product.name}.`,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
        productId: product.id,
      };
      dispatch({ type: 'CREATE_CONVERSATION', payload: newConv });
      dispatch({ type: 'SEND_MESSAGE', payload: {
        id: Math.random().toString(36).substring(2, 10),
        conversationId: newConv.id,
        senderId: state.currentUser.id,
        senderName: state.currentUser.name,
        content: `Hi, I am interested in your ${product.name}.`,
        timestamp: new Date().toISOString(),
        isSystem: false,
      }});
    }
    dispatch({ type: 'CLOSE_MODAL' });
    dispatch({ type: 'SET_SECTION', payload: 'messages' });
    dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: 'Conversation started', type: 'success' } });
  };

  return (
    <Modal maxWidth="max-w-2xl">
      <div className="p-6">
        {/* Header */}
        <div
          className="h-48 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: product.imageColor + '18' }}
        >
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: product.imageColor }}
          >
            {product.name.slice(0, 2)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {product.qualityVerified && <Badge variant="quality"><ShieldCheck className="w-3 h-3" /> Quality Verified</Badge>}
          {product.status === 'preorder' && <Badge variant="preorder">Preorder</Badge>}
          {product.organic && <Badge variant="organic">Organic</Badge>}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">{product.name}</h2>
        <p className="text-sm text-slate-500 mb-4">{product.description}</p>

        {/* Farmer info */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
            {farmer?.avatar || product.farmerName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-slate-800">{product.farmerName}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{product.location}</p>
          </div>
          <button
            onClick={handleMessageFarmer}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Available</p>
            <p className="font-semibold text-slate-800">{product.quantity} {product.unit}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Price</p>
            <p className="font-semibold text-green-700 text-lg">Rs.{product.consumerPrice}<span className="text-xs text-slate-400 font-normal">/{product.unit}</span></p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Hash className="w-3 h-3" />Batch ID</p>
            <p className="font-medium text-slate-700 text-sm">{product.batchId}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Harvest Date</p>
            <p className="font-medium text-slate-700 text-sm">{new Date(product.harvestDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Quality report preview */}
        {qualityReport && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-sm text-green-800">Quality Report</span>
              <Badge variant="verified">{qualityReport.grade}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-green-600">Freshness</p>
                <p className="text-lg font-bold text-green-800">{qualityReport.freshnessScore}%</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Moisture</p>
                <p className="text-lg font-bold text-green-800">{qualityReport.moisture}%</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Pesticide</p>
                <p className="text-lg font-bold text-green-800">{qualityReport.pesticideResidue}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preorder info */}
        {product.status === 'preorder' && (
          <div className="p-4 bg-warm-50 border border-warm-200 rounded-xl mb-4">
            <p className="text-sm font-medium text-harvest-600">
              Expected harvest in {daysToHarvest} days. Preorder now to reserve.
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-slate-200 rounded-l-lg transition-colors">
              <Minus className="w-4 h-4 text-slate-600" />
            </button>
            <span className="w-10 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-2.5 hover:bg-slate-200 rounded-r-lg transition-colors">
              <Plus className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add to Cart — Rs.{product.consumerPrice * qty}
          </button>
        </div>
      </div>
    </Modal>
  );
}
