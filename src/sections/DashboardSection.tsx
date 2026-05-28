import { useState } from 'react';
import { Package, ShoppingCart, TrendingUp, Gavel, Clock, Users, ClipboardCheck, AlertCircle, Plus, Eye } from 'lucide-react';
import { useApp } from '../store';
import type { Auction } from '../types';
import StatCard from '../components/StatCard';
import ProductCard from '../components/ProductCard';
import Badge from '../components/Badge';

export default function DashboardSection() {
  const { state } = useApp();
  const { currentRole } = state;

  if (currentRole === 'consumer') return <ConsumerDashboard />;
  if (currentRole === 'farmer') return <FarmerDashboard />;
  if (currentRole === 'retailer') return <RetailerDashboard />;
  return <AdminDashboard />;
}

function ConsumerDashboard() {
  const { state, dispatch } = useApp();
  const featuredProducts = state.products.filter(p => p.visibility === 'both' || p.visibility === 'consumer').slice(0, 6);
  const preorderProducts = state.products.filter(p => p.status === 'preorder');
  const activeOrders = state.orders.filter(o => o.userId === state.currentUser.id && o.status !== 'delivered');
  const recentPosts = state.communityPosts.slice(0, 2);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{greeting()}!</h2>
        <p className="text-green-100">Fresh from nearby farms, delivered to your doorstep.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for fresh produce..."
          className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'products' })}
        />
      </div>

      {/* Active orders summary */}
      {activeOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">Active Orders</h3>
            <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'orders' })} className="text-sm text-green-600 hover:text-green-700">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {activeOrders.map(order => (
              <div key={order.id} className="min-w-[200px] p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400">{order.id}</p>
                <p className="font-medium text-sm text-slate-800 mt-1">{order.productName} x{order.quantity}</p>
                <Badge variant={order.status}>{order.status.replace(/_/g, ' ')}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Fresh From Farms</h3>
          <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'products' })} className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Preorder Section */}
      {preorderProducts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Available for Preorder</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {preorderProducts.map(product => (
              <div key={product.id} className="min-w-[280px] bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: product.imageColor }}>
                    {product.name[0]}
                  </div>
                  <Badge variant="preorder">Preorder</Badge>
                </div>
                <h4 className="font-semibold text-slate-800">{product.name}</h4>
                <p className="text-xs text-slate-400 mt-1">Expected harvest: {new Date(product.harvestDate).toLocaleDateString()}</p>
                <p className="text-lg font-bold text-green-700 mt-2">Rs.{product.consumerPrice}<span className="text-xs text-slate-400 font-normal">/{product.unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Highlights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">From the Community</h3>
          <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'community' })} className="text-sm text-green-600 hover:text-green-700 font-medium">Browse</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'communityPost', data: post } })}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {post.authorName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{post.authorName}</p>
                  <p className="text-[10px] text-slate-400">{post.authorRole}</p>
                </div>
              </div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">{post.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{post.content}</p>
              <div className="flex gap-2 mt-2">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FarmerDashboard() {
  const { state, dispatch } = useApp();
  const myProducts = state.products.filter(p => p.farmerId === state.currentUser.id);
  const myOrders = state.orders.filter(o => o.farmerId === state.currentUser.id);
  const newOrders = myOrders.filter(o => o.status === 'placed');
  const myAuctions = state.auctions.filter(a => a.farmerId === state.currentUser.id);
  const pendingQuality = state.qualityReports.filter(qr => qr.farmerId === state.currentUser.id && qr.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, {state.currentUser.name.split(' ')[0]}!</h2>
        <p className="text-sm text-slate-500 mt-1">Here is your farm overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Listings" value={myProducts.length} icon={Package} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard label="New Orders" value={newOrders.length} icon={ShoppingCart} iconColor="text-error-500" iconBg="bg-error-50" />
        <StatCard label="Live Auctions" value={myAuctions.filter(a => a.status === 'live').length} icon={Gavel} iconColor="text-harvest-500" iconBg="bg-warm-50" />
        <StatCard label="Pending Quality" value={pendingQuality.length} icon={ClipboardCheck} iconColor="text-blue-600" iconBg="bg-blue-50" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'addListing' } })}
          className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all text-left"
        >
          <Plus className="w-5 h-5 mb-2" />
          <p className="font-semibold text-sm">Add Produce</p>
          <p className="text-xs text-green-100 mt-0.5">List new items</p>
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'auctions' })}
          className="p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left"
        >
          <Gavel className="w-5 h-5 mb-2 text-harvest-500" />
          <p className="font-semibold text-sm">Create Auction</p>
          <p className="text-xs text-slate-400 mt-0.5">Sell in bulk</p>
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'orders' })}
          className="p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left"
        >
          <Eye className="w-5 h-5 mb-2 text-blue-500" />
          <p className="font-semibold text-sm">View Orders</p>
          <p className="text-xs text-slate-400 mt-0.5">Manage orders</p>
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'quality' })}
          className="p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left"
        >
          <ClipboardCheck className="w-5 h-5 mb-2 text-purple-500" />
          <p className="font-semibold text-sm">Quality Check</p>
          <p className="text-xs text-slate-400 mt-0.5">Book inspection</p>
        </button>
      </div>

      {/* New Orders */}
      {newOrders.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              New Orders
              <span className="bg-error-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{newOrders.length}</span>
            </h3>
            <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'orders' })} className="text-sm text-green-600">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {newOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{order.productName} x{order.quantity} {order.unit}</p>
                  <p className="text-xs text-slate-400">{order.userName} &middot; Rs.{order.totalAmount}</p>
                </div>
                <button
                  onClick={() => {
                    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: 'accepted' } });
                    dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: 'Order accepted', type: 'success' } });
                  }}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No new orders. Your products are being viewed!</p>
        </div>
      )}

      {/* My Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">My Listings</h3>
          <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'products' })} className="text-sm text-green-600">Manage All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.slice(0, 3).map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: product.imageColor }}>
                  {product.name[0]}
                </div>
                <Badge variant={product.qualityVerified ? 'verified' : 'pending'}>
                  {product.qualityVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              <h4 className="font-semibold text-slate-800">{product.name}</h4>
              <p className="text-xs text-slate-400">{product.quantity} {product.unit} &middot; Rs.{product.consumerPrice}/{product.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RetailerDashboard() {
  const { state, dispatch } = useApp();
  const liveAuctions = state.auctions.filter(a => a.status === 'live' || a.status === 'closing_soon');
  const closingSoon = liveAuctions.filter(a => a.status === 'closing_soon');
  const myBids = state.bids.filter(b => b.retailerId === state.currentUser.id);
  const activeOrders = state.orders.filter(o => o.userId === state.currentUser.id && o.status !== 'delivered');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Good morning!</h2>
        <p className="text-sm text-slate-500 mt-1">Find your next bulk lot from local farms.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Live Auctions" value={liveAuctions.length} icon={Gavel} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard label="Closing Soon" value={closingSoon.length} icon={Clock} iconColor="text-harvest-500" iconBg="bg-warm-50" />
        <StatCard label="My Bids" value={myBids.length} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard label="Active Orders" value={activeOrders.length} icon={Package} iconColor="text-purple-600" iconBg="bg-purple-50" />
      </div>

      {/* Live Auctions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Live Auctions</h3>
          <button onClick={() => dispatch({ type: 'SET_SECTION', payload: 'auctions' })} className="text-sm text-green-600">View All</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {liveAuctions.slice(0, 4).map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { state } = useApp();
  const pendingQuality = state.qualityReports.filter(qr => qr.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Platform Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor and manage the marketplace.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={state.users.length} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard label="Total Listings" value={state.products.length} icon={Package} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard label="Active Auctions" value={state.auctions.filter(a => a.status === 'live').length} icon={Gavel} iconColor="text-harvest-500" iconBg="bg-warm-50" />
        <StatCard label="Pending Approvals" value={pendingQuality.length} icon={ClipboardCheck} iconColor="text-error-500" iconBg="bg-error-50" />
      </div>

      {/* Pending Quality Approvals */}
      {pendingQuality.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Pending Quality Approvals</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingQuality.map(report => (
              <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{report.productName}</p>
                  <p className="text-xs text-slate-400">{report.farmerName} &middot; Batch: {report.batchId}</p>
                </div>
                <Badge variant="pending">Pending</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AuctionCard({ auction }: { auction: Auction }) {
  const { dispatch } = useApp();
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minIncrement);

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{auction.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{auction.farmerName} &middot; {auction.location}</p>
        </div>
        <Badge variant={auction.status === 'closing_soon' ? 'auction-closing' : 'auction-live'}>
          {auction.status === 'closing_soon' ? 'Closing Soon' : 'Live'}
        </Badge>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-green-700">Rs.{auction.currentBid}</span>
        <span className="text-xs text-slate-400">/ {auction.unit}</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{auction.bidCount} bids &middot; Min increment: Rs.{auction.minIncrement}</p>
      <div className="flex gap-2">
        <input
          type="number"
          value={bidAmount}
          onChange={e => setBidAmount(Number(e.target.value))}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
        />
        <button
          onClick={() => {
            dispatch({ type: 'PLACE_BID', payload: {
              id: Math.random().toString(36).substring(2, 10),
              auctionId: auction.id,
              retailerId: 'u9',
              retailerName: 'FreshMart Retail',
              amount: bidAmount,
              timestamp: new Date().toISOString(),
            }});
            dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: 'Bid placed successfully!', type: 'success' } });
          }}
          className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
        >
          Bid
        </button>
      </div>
    </div>
  );
}


