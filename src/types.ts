export type UserRole = 'consumer' | 'farmer' | 'retailer' | 'admin';

export type ProductCategory = 'Vegetables' | 'Fruits' | 'Grains' | 'Spices' | 'Others';
export type ProductStatus = 'ready' | 'preorder';
export type ProductVisibility = 'consumer' | 'retailer' | 'both';

export type OrderStatus = 'placed' | 'accepted' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type AuctionStatus = 'live' | 'closing_soon' | 'ended';

export type QualityStatus = 'pending' | 'scheduled' | 'verified' | 'rejected';

export type PostType = 'recipe' | 'story' | 'tips' | 'featured_farmer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  avatar: string;
  joinDate: string;
  contact: string;
  bio?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  farmerId: string;
  farmerName: string;
  location: string;
  quantity: number;
  unit: string;
  consumerPrice: number;
  retailerBasePrice: number;
  status: ProductStatus;
  harvestDate: string;
  qualityVerified: boolean;
  qualityReportId: string | null;
  batchId: string;
  freshnessScore: number;
  organic: boolean;
  description: string;
  visibility: ProductVisibility;
  createdDate: string;
  imageColor: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userRole: 'consumer' | 'retailer';
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  expectedDelivery: string;
  farmerId: string;
  farmerName: string;
  unit: string;
}

export interface Auction {
  id: string;
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  title: string;
  quantity: number;
  unit: string;
  location: string;
  basePrice: number;
  currentBid: number;
  minIncrement: number;
  bidCount: number;
  endTime: string;
  status: AuctionStatus;
  winnerId: string | null;
  winnerName: string | null;
  description: string;
  imageColor: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  retailerId: string;
  retailerName: string;
  amount: number;
  timestamp: string;
}

export interface QualityReport {
  id: string;
  productId: string;
  productName: string;
  batchId: string;
  farmerId: string;
  farmerName: string;
  grade: string;
  freshnessScore: number;
  moisture: number;
  pesticideResidue: 'Pass' | 'Fail';
  inspectionDate: string;
  labName: string;
  notes: string;
  status: QualityStatus;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productId?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  createdDate: string;
  type: PostType;
  imageColor: string;
  liked?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'order' | 'message' | 'auction' | 'quality' | 'system';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface AppUI {
  cartOpen: boolean;
  activeModal: string | null;
  modalData: any;
  sidebarOpen: boolean;
}

export interface AppState {
  currentRole: UserRole;
  currentUser: User;
  currentSection: string;
  users: User[];
  products: Product[];
  orders: Order[];
  auctions: Auction[];
  bids: Bid[];
  qualityReports: QualityReport[];
  conversations: Conversation[];
  messages: Message[];
  communityPosts: CommunityPost[];
  cart: CartItem[];
  notifications: Notification[];
  toasts: Toast[];
  ui: AppUI;
}
