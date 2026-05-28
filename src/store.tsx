import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, UserRole, Product, Order, Auction, Bid, Message, Conversation, Toast } from './types';
import { users, products, orders, auctions, bids, qualityReports, conversations, messages, communityPosts, notifications } from './data';

const currentUserMap: Record<UserRole, string> = {
  consumer: 'u7',
  farmer: 'u1',
  retailer: 'u9',
  admin: 'admin',
};

const initialState: AppState = {
  currentRole: 'consumer',
  currentUser: users.find(u => u.id === 'u7')!,
  currentSection: 'dashboard',
  users,
  products,
  orders,
  auctions,
  bids,
  qualityReports,
  conversations,
  messages,
  communityPosts,
  cart: [],
  notifications,
  toasts: [],
  ui: {
    cartOpen: false,
    activeModal: null,
    modalData: null,
    sidebarOpen: false,
  },
};

type Action =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_SECTION'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QTY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER'; payload: { productId: string; quantity: number; totalAmount: number } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'PLACE_BID'; payload: Bid }
  | { type: 'CREATE_AUCTION'; payload: Auction }
  | { type: 'APPROVE_QUALITY'; payload: string }
  | { type: 'REJECT_QUALITY'; payload: { id: string; reason: string } }
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'CREATE_CONVERSATION'; payload: Conversation }
  | { type: 'MARK_CONVERSATION_READ'; payload: string }
  | { type: 'SHOW_TOAST'; payload: Toast }
  | { type: 'DISMISS_TOAST'; payload: string }
  | { type: 'OPEN_MODAL'; payload: { modal: string; data?: any } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { userId: string; title: string; message: string; type: 'order' | 'message' | 'auction' | 'quality' | 'system' } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LIKE_POST'; payload: string };

function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 900 + 100);
  return `FC-${dateStr}-${random}`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE': {
      const userId = currentUserMap[action.payload];
      const user = state.users.find(u => u.id === userId);
      return {
        ...state,
        currentRole: action.payload,
        currentUser: user || state.currentUser,
      };
    }
    case 'SET_SECTION':
      return { ...state, currentSection: action.payload };
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { productId: action.payload.productId, quantity: action.payload.quantity }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.productId !== action.payload) };
    case 'UPDATE_CART_QTY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'PLACE_ORDER': {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (!product) return state;
      const orderId = generateOrderId();
      const orderDate = new Date().toISOString();
      const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const newOrder: Order = {
        id: orderId,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        userRole: state.currentRole === 'retailer' ? 'retailer' : 'consumer',
        productId: product.id,
        productName: product.name,
        quantity: action.payload.quantity,
        totalAmount: action.payload.totalAmount,
        status: 'placed',
        orderDate,
        expectedDelivery: deliveryDate,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        unit: product.unit,
      };
      // Create or update conversation
      const existingConv = state.conversations.find(c =>
        c.participantIds.includes(state.currentUser.id) && c.participantIds.includes(product.farmerId) && c.productId === product.id
      );
      const systemMsg: Message = {
        id: generateId(),
        conversationId: existingConv ? existingConv.id : generateId(),
        senderId: 'system',
        senderName: 'System',
        content: `Order ${orderId} has been placed for ${product.name}.`,
        timestamp: orderDate,
        isSystem: true,
      };
      let newConversations = [...state.conversations];
      if (!existingConv) {
        const newConv: Conversation = {
          id: systemMsg.conversationId,
          participantIds: [state.currentUser.id, product.farmerId],
          participantNames: [state.currentUser.name, product.farmerName],
          lastMessage: systemMsg.content,
          lastMessageTime: orderDate,
          unreadCount: 1,
          productId: product.id,
        };
        newConversations = [...newConversations, newConv];
      } else {
        newConversations = newConversations.map(c =>
          c.id === existingConv.id
            ? { ...c, lastMessage: systemMsg.content, lastMessageTime: orderDate, unreadCount: c.participantIds[0] === product.farmerId ? c.unreadCount + 1 : c.unreadCount + 1 }
            : c
        );
      }
      const farmerNotification = {
        id: generateId(),
        userId: product.farmerId,
        title: 'New Order',
        message: `${state.currentUser.name} placed an order for ${product.name}.`,
        read: false,
        timestamp: orderDate,
        type: 'order' as const,
      };
      return {
        ...state,
        orders: [...state.orders, newOrder],
        messages: [...state.messages, systemMsg],
        conversations: newConversations,
        notifications: [...state.notifications, farmerNotification],
        cart: state.cart.filter(item => item.productId !== product.id),
      };
    }
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_ORDER_STATUS': {
      const updatedOrders = state.orders.map(o =>
        o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
      );
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (!order) return state;
      const statusMessages: Record<string, string> = {
        accepted: `Order ${order.id} has been accepted by the farmer.`,
        packed: `Order ${order.id} is being packed.`,
        dispatched: `Order ${order.id} has been dispatched.`,
        out_for_delivery: `Order ${order.id} is out for delivery.`,
        delivered: `Order ${order.id} has been delivered.`,
      };
      const msgContent = statusMessages[action.payload.status];
      if (!msgContent) return { ...state, orders: updatedOrders };
      const conv = state.conversations.find(c =>
        c.participantIds.includes(order.userId) && c.participantIds.includes(order.farmerId)
      );
      if (!conv) return { ...state, orders: updatedOrders };
      const sysMsg: Message = {
        id: generateId(),
        conversationId: conv.id,
        senderId: 'system',
        senderName: 'System',
        content: msgContent,
        timestamp: new Date().toISOString(),
        isSystem: true,
      };
      const updatedConversations = state.conversations.map(c =>
        c.id === conv.id
          ? { ...c, lastMessage: sysMsg.content, lastMessageTime: sysMsg.timestamp }
          : c
      );
      return {
        ...state,
        orders: updatedOrders,
        messages: [...state.messages, sysMsg],
        conversations: updatedConversations,
      };
    }
    case 'PLACE_BID': {
      const updatedAuctions = state.auctions.map(a =>
        a.id === action.payload.auctionId
          ? { ...a, currentBid: action.payload.amount, bidCount: a.bidCount + 1 }
          : a
      );
      return {
        ...state,
        auctions: updatedAuctions,
        bids: [...state.bids, action.payload],
      };
    }
    case 'CREATE_AUCTION':
      return { ...state, auctions: [...state.auctions, action.payload] };
    case 'APPROVE_QUALITY': {
      const report = state.qualityReports.find(qr => qr.id === action.payload);
      if (!report) return state;
      const updatedProducts = state.products.map(p =>
        p.qualityReportId === action.payload ? { ...p, qualityVerified: true } : p
      );
      const updatedReports = state.qualityReports.map(qr =>
        qr.id === action.payload ? { ...qr, status: 'verified' as const } : qr
      );
      return { ...state, products: updatedProducts, qualityReports: updatedReports };
    }
    case 'REJECT_QUALITY': {
      return {
        ...state,
        qualityReports: state.qualityReports.map(qr =>
          qr.id === action.payload.id ? { ...qr, status: 'rejected' as const } : qr
        ),
      };
    }
    case 'SEND_MESSAGE': {
      const updatedConversations = state.conversations.map(c =>
        c.id === action.payload.conversationId
          ? { ...c, lastMessage: action.payload.content, lastMessageTime: action.payload.timestamp }
          : c
      );
      return {
        ...state,
        messages: [...state.messages, action.payload],
        conversations: updatedConversations,
      };
    }
    case 'CREATE_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] };
    case 'MARK_CONVERSATION_READ':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.payload ? { ...c, unreadCount: 0 } : c
        ),
      };
    case 'SHOW_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'OPEN_MODAL':
      return { ...state, ui: { ...state.ui, activeModal: action.payload.modal, modalData: action.payload.data || null } };
    case 'CLOSE_MODAL':
      return { ...state, ui: { ...state.ui, activeModal: null, modalData: null } };
    case 'TOGGLE_CART':
      return { ...state, ui: { ...state.ui, cartOpen: !state.ui.cartOpen } };
    case 'SET_CART_OPEN':
      return { ...state, ui: { ...state.ui, cartOpen: action.payload } };
    case 'TOGGLE_SIDEBAR':
      return { ...state, ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, ui: { ...state.ui, sidebarOpen: action.payload } };
    case 'ADD_NOTIFICATION': {
      const notif = {
        id: generateId(),
        userId: action.payload.userId,
        title: action.payload.title,
        message: action.payload.message,
        read: false,
        timestamp: new Date().toISOString(),
        type: action.payload.type,
      };
      return { ...state, notifications: [...state.notifications, notif] };
    }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'LIKE_POST':
      return {
        ...state,
        communityPosts: state.communityPosts.map(p =>
          p.id === action.payload ? { ...p, likes: p.likes + 1, liked: true } : p
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
