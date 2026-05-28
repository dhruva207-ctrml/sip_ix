import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useApp } from '../store';
import type { Order } from '../types';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

const statusSteps = ['placed', 'accepted', 'packed', 'dispatched', 'delivered'];
const statusLabels: Record<string, string> = {
  placed: 'Placed', accepted: 'Accepted', packed: 'Packed',
  dispatched: 'Dispatched', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrdersSection() {
  const { state } = useApp();
  if (state.currentRole === 'consumer') return <ConsumerOrders />;
  if (state.currentRole === 'farmer') return <FarmerOrders />;
  if (state.currentRole === 'retailer') return <RetailerOrders />;
  return <AdminOrders />;
}

function ConsumerOrders() {
  const { state } = useApp();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const myOrders = state.orders.filter(o => o.userId === state.currentUser.id);
  const filtered = tab === 'active'
    ? myOrders.filter(o => o.status !== 'delivered')
    : myOrders.filter(o => o.status === 'delivered');

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
      <div className="flex gap-1 bg-slate-100 rounded-full p-1 w-fit">
        {(['active', 'completed'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState icon="package" title={`No ${tab} orders`} description={tab === 'active' ? 'Start shopping to see your orders here.' : 'Your completed orders will appear here.'} />
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { state, dispatch } = useApp();
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-slate-400">{order.id}</p>
          <h4 className="font-semibold text-slate-800 mt-0.5">{order.productName} x{order.quantity} {order.unit}</h4>
          <p className="text-xs text-slate-400 mt-1">From {order.farmerName}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-800">Rs.{order.totalAmount}</p>
          <Badge variant={order.status}>{statusLabels[order.status]}</Badge>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-1 mb-4">
        {statusSteps.map((step, i) => (
          <div key={step} className="flex-1 flex items-center">
            <div className={`w-3 h-3 rounded-full ${
              i <= currentStep ? 'bg-green-500' : 'bg-slate-200'
            }`} />
            {i < statusSteps.length - 1 && (
              <div className={`flex-1 h-0.5 ${
                i < currentStep ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 -mt-2 mb-3">
        {statusSteps.map(step => (
          <span key={step} className="flex-1 text-center">{statusLabels[step]}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <p className="text-xs text-slate-400">Expected: {new Date(order.expectedDelivery).toLocaleDateString()}</p>
        <button
          onClick={() => {
            const conv = state.conversations.find(c =>
              c.participantIds.includes(order.userId) && c.participantIds.includes(order.farmerId)
            );
            if (conv) {
              dispatch({ type: 'SET_SECTION', payload: 'messages' });
            }
          }}
          className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          <MessageSquare className="w-4 h-4" /> Message
        </button>
      </div>
    </div>
  );
}

function FarmerOrders() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<'new' | 'processing' | 'completed'>('new');
  const myOrders = state.orders.filter(o => o.farmerId === state.currentUser.id);

  const filtered = tab === 'new'
    ? myOrders.filter(o => o.status === 'placed')
    : tab === 'processing'
    ? myOrders.filter(o => o.status !== 'placed' && o.status !== 'delivered')
    : myOrders.filter(o => o.status === 'delivered');

  const nextStatus: Record<string, string> = {
    placed: 'accepted', accepted: 'packed', packed: 'dispatched', dispatched: 'out_for_delivery', out_for_delivery: 'delivered',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
      <div className="flex gap-1 bg-slate-100 rounded-full p-1 w-fit">
        {(['new', 'processing', 'completed'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t === 'new' ? 'New' : t === 'processing' ? 'Processing' : 'Completed'}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400">{order.id}</p>
                  <h4 className="font-semibold text-slate-800">{order.productName} x{order.quantity} {order.unit}</h4>
                  <p className="text-xs text-slate-400">{order.userName} &middot; Rs.{order.totalAmount}</p>
                </div>
                <Badge variant={order.status}>{statusLabels[order.status]}</Badge>
              </div>
              {tab === 'new' && (
                <div className="flex gap-2">
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
              )}
              {tab === 'processing' && nextStatus[order.status] && (
                <button
                  onClick={() => {
                    const ns = nextStatus[order.status] as any;
                    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: ns } });
                    dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `Order marked as ${statusLabels[ns]}`, type: 'success' } });
                  }}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
                >
                  Mark as {statusLabels[nextStatus[order.status]]}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="package" title={`No ${tab} orders`} description="Orders will appear here when customers place them." />
      )}
    </div>
  );
}

function RetailerOrders() {
  const { state } = useApp();
  const myOrders = state.orders.filter(o => o.userId === state.currentUser.id);

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Wholesale Orders</h2>
      {myOrders.length > 0 ? (
        <div className="space-y-4">
          {myOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState icon="package" title="No orders yet" description="Your wholesale orders will appear here." />
      )}
    </div>
  );
}

function AdminOrders() {
  const { state } = useApp();

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">All Orders</h2>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {state.orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{order.id}</td>
                  <td className="px-4 py-3 text-slate-700">{order.userName}</td>
                  <td className="px-4 py-3 text-slate-700">{order.productName} x{order.quantity}</td>
                  <td className="px-4 py-3 font-medium">Rs.{order.totalAmount}</td>
                  <td className="px-4 py-3"><Badge variant={order.status}>{statusLabels[order.status]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
