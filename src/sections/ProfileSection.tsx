import { MapPin, Phone, Calendar, ShoppingCart, Package, Gavel } from 'lucide-react';
import { useApp } from '../store';

export default function ProfileSection() {
  const { state } = useApp();
  const { currentUser, currentRole } = state;

  const myOrders = state.orders.filter(o => o.userId === currentUser.id);
  const myProducts = state.products.filter(p => p.farmerId === currentUser.id);
  const myAuctions = state.auctions.filter(a => a.farmerId === currentUser.id);

  const roleLabels: Record<string, string> = {
    consumer: 'Consumer',
    farmer: 'Farmer',
    retailer: 'Retailer',
    admin: 'Admin',
  };

  const roleColors: Record<string, string> = {
    consumer: 'bg-green-50 text-green-700',
    farmer: 'bg-warm-50 text-harvest-600',
    retailer: 'bg-blue-50 text-blue-700',
    admin: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[currentRole]}`}>
                {roleLabels[currentRole]}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{currentUser.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">{currentUser.contact}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Joined {new Date(currentUser.joinDate).toLocaleDateString()}</span>
          </div>
          {currentUser.bio && (
            <p className="text-sm text-slate-500 mt-2">{currentUser.bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {currentRole === 'consumer' && (
          <>
            <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <ShoppingCart className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{myOrders.length}</p>
              <p className="text-xs text-slate-400">Orders</p>
            </div>
          </>
        )}
        {currentRole === 'farmer' && (
          <>
            <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <Package className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{myProducts.length}</p>
              <p className="text-xs text-slate-400">Listings</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <ShoppingCart className="w-5 h-5 text-harvest-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{myOrders.length}</p>
              <p className="text-xs text-slate-400">Orders</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <Gavel className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{myAuctions.length}</p>
              <p className="text-xs text-slate-400">Auctions</p>
            </div>
          </>
        )}
        {currentRole === 'retailer' && (
          <>
            <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
              <Gavel className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{state.bids.filter(b => b.retailerId === currentUser.id).length}</p>
              <p className="text-xs text-slate-400">Bids</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
