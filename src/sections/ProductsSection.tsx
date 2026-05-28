import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Plus, Eye } from 'lucide-react';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

export default function ProductsSection() {
  const { state } = useApp();

  if (state.currentRole === 'consumer') return <ConsumerProducts />;
  if (state.currentRole === 'farmer') return <FarmerProducts />;
  if (state.currentRole === 'retailer') return <RetailerProducts />;
  return <AdminProducts />;
}

function ConsumerProducts() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [qualityOnly, setQualityOnly] = useState(false);
  const [preorderOnly, setPreorderOnly] = useState(false);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Others'];

  const filtered = state.products.filter(p => {
    if (p.visibility === 'retailer') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && p.category !== category) return false;
    if (qualityOnly && !p.qualityVerified) return false;
    if (preorderOnly && p.status !== 'preorder') return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Browse Products</h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                category === cat ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-green-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setQualityOnly(!qualityOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              qualityOnly ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" /> Quality Verified
          </button>
          <button
            onClick={() => setPreorderOnly(!preorderOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              preorderOnly ? 'bg-harvest-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Preorder Only
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-400">{filtered.length} products found</p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="No products match"
          description="Try adjusting your filters or search terms."
          action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setCategory('All'); setQualityOnly(false); setPreorderOnly(false); } }}
        />
      )}
    </div>
  );
}

function FarmerProducts() {
  const { state, dispatch } = useApp();
  const myProducts = state.products.filter(p => p.farmerId === state.currentUser.id);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">My Listings</h2>
        <button
          onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'addListing' } })}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Produce
        </button>
      </div>

      {myProducts.length > 0 ? (
        <div className="space-y-3">
          {myProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: product.imageColor }}>
                {product.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-800">{product.name}</h4>
                  <Badge variant={product.qualityVerified ? 'verified' : 'pending'}>
                    {product.qualityVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{product.quantity} {product.unit} &middot; Rs.{product.consumerPrice}/{product.unit} &middot; <MapPin className="w-3 h-3 inline" />{product.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'productDetail', data: product } })}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="package"
          title="No listings yet"
          description="Start by adding your first produce listing!"
          action={{ label: 'Add Produce', onClick: () => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'addListing' } }) }}
        />
      )}
    </div>
  );
}

function RetailerProducts() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const bulkProducts = state.products.filter(p => p.visibility === 'retailer' || p.visibility === 'both');

  const filtered = bulkProducts.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Bulk Listings</h2>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search bulk listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-400"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function AdminProducts() {
  const { state } = useApp();

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">All Listings</h2>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Farmer</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Quality</th>
                <th className="text-left px-4 py-3 font-medium">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {state.products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 text-slate-500">{product.farmerName}</td>
                  <td className="px-4 py-3 text-slate-600">Rs.{product.consumerPrice}/{product.unit}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.qualityVerified ? 'verified' : 'pending'}>
                      {product.qualityVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{product.visibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
