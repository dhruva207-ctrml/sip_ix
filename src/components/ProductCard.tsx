import { MapPin, Plus, Eye } from 'lucide-react';
import { useApp } from '../store';
import Badge from './Badge';
import type { Product } from '../types';
import type { KeyboardEvent } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useApp();

  const daysSinceHarvest = Math.floor(
    (Date.now() - new Date(product.harvestDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isFresh = daysSinceHarvest <= 3;

  const titleId = `product-title-${product.id}`;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dispatch({ type: 'OPEN_MODAL', payload: { modal: 'productDetail', data: product } });
    }
  };

  return (
    <div className="card overflow-hidden animate-fade-in-up group" role="article" tabIndex={0} aria-labelledby={titleId} onKeyDown={onKeyDown}>
      {/* Image area */}
      <div
        className="relative h-40 flex items-center justify-center"
        style={{ backgroundColor: product.imageColor + '18' }}
        role="img"
        aria-label={`${product.name} image`}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: product.imageColor }}
          aria-hidden="true"
        >
          {product.name[0]}
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {product.qualityVerified && <Badge variant="quality">Quality Verified</Badge>}
          {product.status === 'preorder' && <Badge variant="preorder">Preorder</Badge>}
          {isFresh && product.status === 'ready' && <Badge variant="fresh">Fresh</Badge>}
          {product.organic && <Badge variant="organic">Organic</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 id={titleId} className="font-semibold text-contrast text-[15px] mb-1">{product.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
            {product.farmerName.split(' ').map(n => n[0]).join('')}
          </div>
          <span>{product.farmerName}</span>
          <span className="text-slate-300">|</span>
          <MapPin className="w-3 h-3" />
          <span>{product.location}</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          {product.quantity} {product.unit} available
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-700">Rs.{product.consumerPrice}</span>
            <span className="text-xs text-slate-400">/{product.unit}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'productDetail', data: product } })}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              title="View details"
              aria-label={`View details for ${product.name}`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity: 1 } });
                dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `${product.name} added to cart`, type: 'success' } });
              }}
              className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors active:scale-95"
              title="Add to cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
