import { useState } from 'react';
import { CheckCircle, MapPin, CreditCard, Truck } from 'lucide-react';
import { useApp } from '../store';
import Modal from './Modal';

const addresses = [
  { id: 'a1', label: 'Home', address: '42, 4th Cross, Jayanagar, Bengaluru - 560011' },
  { id: 'a2', label: 'Office', address: 'Plot 12, Tech Park, Electronic City, Bengaluru - 560100' },
];

export default function CheckoutModal() {
  const { state, dispatch } = useApp();
  const data = state.ui.modalData;
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState('a1');
  const [orderId, setOrderId] = useState('');

  if (!data) return null;
  const { items, total } = data;

  const handlePlaceOrder = () => {
    items.forEach((item: any) => {
      dispatch({
        type: 'PLACE_ORDER',
        payload: {
          productId: item.productId,
          quantity: item.quantity,
          totalAmount: item.product!.consumerPrice * item.quantity,
        },
      });
    });
    // Get the last created order id
    const lastOrder = state.orders[state.orders.length - 1];
    setOrderId(lastOrder?.id || generateOrderId());
    dispatch({ type: 'CLEAR_CART' });
    setStep(3);
  };

  return (
    <Modal maxWidth="max-w-md">
      <div className="p-6">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Delivery Address</h2>
            <div className="space-y-3 mb-6">
              {addresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedAddress === addr.id ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <MapPin className={`w-5 h-5 mt-0.5 ${selectedAddress === addr.id ? 'text-green-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-medium text-slate-800">{addr.label}</p>
                    <p className="text-sm text-slate-500">{addr.address}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Payment Method</h2>
            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-xl border-2 border-green-500 bg-green-50 flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-slate-800">Cash on Delivery</p>
                  <p className="text-sm text-slate-500">Pay when you receive</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border-2 border-slate-100 flex items-center gap-3 opacity-50">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-800">UPI / Online</p>
                  <p className="text-sm text-slate-500">Coming soon</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-bold text-slate-800">Rs.{total}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-medium rounded-full hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
              >
                Place Order
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Order Placed!</h2>
            <p className="text-sm text-slate-500 mb-4">Your order has been confirmed</p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-slate-400 mb-1">Order ID</p>
              <p className="text-lg font-bold text-slate-800">{orderId}</p>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'CLOSE_MODAL' });
                dispatch({ type: 'SET_SECTION', payload: 'orders' });
              }}
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
            >
              Track Order
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 900 + 100);
  return `FC-${dateStr}-${random}`;
}
