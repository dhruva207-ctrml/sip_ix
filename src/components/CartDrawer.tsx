import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useApp } from '../store';

export default function CartDrawer() {
  const { state, dispatch } = useApp();
  const cartItems = state.cart.map(item => {
    const product = state.products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product!.consumerPrice * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {state.ui.cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[210] shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-slate-800">Your Cart</h2>
                <span className="text-sm text-slate-400">({cartItems.length} items)</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">Your cart is empty</p>
                  <p className="text-sm text-slate-400 mt-1">Browse products to add items</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.productId} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                      <div
                        className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: item.product!.imageColor }}
                      >
                        {item.product!.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 text-sm truncate">{item.product!.name}</h4>
                        <p className="text-xs text-slate-400">{item.product!.farmerName}</p>
                        <p className="text-sm font-semibold text-green-700 mt-1">
                          Rs.{item.product!.consumerPrice * item.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId })}
                          className="text-xs text-slate-400 hover:text-error-500 transition-colors"
                        >
                          Remove
                        </button>
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) {
                                dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId });
                              } else {
                                dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: item.productId, quantity: item.quantity - 1 } });
                              }
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-l-lg"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: item.productId, quantity: item.quantity + 1 } })}
                            className="p-1.5 hover:bg-slate-100 rounded-r-lg"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">Rs.{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Delivery</span>
                    <span className="font-medium">{deliveryFee === 0 ? 'Free' : `Rs.${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-green-700">Rs.{total}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_CART_OPEN', payload: false });
                    dispatch({ type: 'OPEN_MODAL', payload: { modal: 'checkout', data: { items: cartItems, subtotal, deliveryFee, total } } });
                  }}
                  className="w-full py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 active:scale-[0.98] transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
