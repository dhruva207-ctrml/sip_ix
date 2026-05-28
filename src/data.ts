import type { User, Product, Order, Auction, Bid, QualityReport, Conversation, Message, CommunityPost, Notification } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Ramesh Gowda', role: 'farmer', location: 'Mysuru', avatar: 'RG', joinDate: '2023-06-15', contact: '9876543210', bio: 'Organic farmer with 15 years of experience' },
  { id: 'u2', name: 'Lakshmi Hegde', role: 'farmer', location: 'Chikkamagaluru', avatar: 'LH', joinDate: '2023-08-20', contact: '9876543211' },
  { id: 'u3', name: 'Shobha Nayak', role: 'farmer', location: 'Mangaluru', avatar: 'SN', joinDate: '2023-09-10', contact: '9876543212' },
  { id: 'u4', name: 'Ravi Poojary', role: 'farmer', location: 'Udupi', avatar: 'RP', joinDate: '2023-07-05', contact: '9876543213' },
  { id: 'u5', name: 'Manjunath', role: 'farmer', location: 'Haveri', avatar: 'MJ', joinDate: '2023-10-01', contact: '9876543214' },
  { id: 'u6', name: 'Kavitha', role: 'farmer', location: 'Shivamogga', avatar: 'KV', joinDate: '2023-11-12', contact: '9876543215' },
  { id: 'u7', name: 'Priya Sharma', role: 'consumer', location: 'Bengaluru', avatar: 'PS', joinDate: '2024-01-15', contact: '9876543220' },
  { id: 'u8', name: 'Arun Kumar', role: 'consumer', location: 'Mysuru', avatar: 'AK', joinDate: '2024-02-20', contact: '9876543221' },
  { id: 'u9', name: 'FreshMart Retail', role: 'retailer', location: 'Bengaluru', avatar: 'FR', joinDate: '2023-12-01', contact: '9876543230', bio: 'Leading fresh produce retail chain' },
  { id: 'u10', name: 'Green Basket Wholesale', role: 'retailer', location: 'Mangaluru', avatar: 'GB', joinDate: '2024-01-10', contact: '9876543231' },
  { id: 'u11', name: 'Udupi Bulk Foods', role: 'retailer', location: 'Udupi', avatar: 'UB', joinDate: '2024-02-05', contact: '9876543232' },
  { id: 'admin', name: 'Platform Admin', role: 'admin', location: 'Bengaluru', avatar: 'PA', joinDate: '2023-01-01', contact: 'admin@agrolink.in' },
];

export const products: Product[] = [
  {
    id: 'p1', name: 'Ragi', category: 'Grains', farmerId: 'u1', farmerName: 'Ramesh Gowda',
    location: 'Mysuru', quantity: 500, unit: 'kg', consumerPrice: 65, retailerBasePrice: 55,
    status: 'ready', harvestDate: '2025-04-20', qualityVerified: true, qualityReportId: 'qr1',
    batchId: 'FC-MYS-001', freshnessScore: 95, organic: true,
    description: 'Premium organic ragi (finger millet) freshly harvested. Rich in calcium and fiber.',
    visibility: 'both', createdDate: '2025-04-22', imageColor: '#8B6914'
  },
  {
    id: 'p2', name: 'Tomato', category: 'Vegetables', farmerId: 'u4', farmerName: 'Ravi Poojary',
    location: 'Udupi', quantity: 200, unit: 'kg', consumerPrice: 35, retailerBasePrice: 28,
    status: 'ready', harvestDate: '2025-04-24', qualityVerified: true, qualityReportId: 'qr2',
    batchId: 'FC-UDP-002', freshnessScore: 92, organic: false,
    description: 'Farm-fresh tomatoes, perfect for curries and salads. Vine-ripened for maximum flavor.',
    visibility: 'both', createdDate: '2025-04-23', imageColor: '#E74C3C'
  },
  {
    id: 'p3', name: 'Coconut', category: 'Fruits', farmerId: 'u3', farmerName: 'Shobha Nayak',
    location: 'Mangaluru', quantity: 300, unit: 'piece', consumerPrice: 25, retailerBasePrice: 20,
    status: 'ready', harvestDate: '2025-04-23', qualityVerified: false, qualityReportId: null,
    batchId: 'FC-MNG-003', freshnessScore: 88, organic: true,
    description: 'Tender coconuts from coastal Karnataka. Sweet water and soft malai.',
    visibility: 'both', createdDate: '2025-04-21', imageColor: '#6B8E23'
  },
  {
    id: 'p4', name: 'Turmeric', category: 'Spices', farmerId: 'u2', farmerName: 'Lakshmi Hegde',
    location: 'Chikkamagaluru', quantity: 100, unit: 'kg', consumerPrice: 280, retailerBasePrice: 240,
    status: 'ready', harvestDate: '2025-04-18', qualityVerified: true, qualityReportId: 'qr3',
    batchId: 'FC-CMG-004', freshnessScore: 96, organic: true,
    description: 'High-curcinin turmeric from the hills of Chikkamagaluru. Naturally dried.',
    visibility: 'both', createdDate: '2025-04-20', imageColor: '#DAA520'
  },
  {
    id: 'p5', name: 'Banana', category: 'Fruits', farmerId: 'u4', farmerName: 'Ravi Poojary',
    location: 'Udupi', quantity: 150, unit: 'dozen', consumerPrice: 60, retailerBasePrice: 50,
    status: 'ready', harvestDate: '2025-04-25', qualityVerified: false, qualityReportId: null,
    batchId: 'FC-UDP-005', freshnessScore: 90, organic: false,
    description: 'Sweet Yelakki bananas, perfect for everyday consumption.',
    visibility: 'both', createdDate: '2025-04-24', imageColor: '#F4D03F'
  },
  {
    id: 'p6', name: 'Chilli', category: 'Spices', farmerId: 'u5', farmerName: 'Manjunath',
    location: 'Haveri', quantity: 80, unit: 'kg', consumerPrice: 120, retailerBasePrice: 100,
    status: 'ready', harvestDate: '2025-04-22', qualityVerified: false, qualityReportId: null,
    batchId: 'FC-HVR-006', freshnessScore: 89, organic: true,
    description: 'Byadagi chillies — mildly pungent, deep red color, perfect for sambar powder.',
    visibility: 'both', createdDate: '2025-04-23', imageColor: '#C0392B'
  },
  {
    id: 'p7', name: 'Onion', category: 'Vegetables', farmerId: 'u1', farmerName: 'Ramesh Gowda',
    location: 'Mysuru', quantity: 400, unit: 'kg', consumerPrice: 30, retailerBasePrice: 24,
    status: 'ready', harvestDate: '2025-04-21', qualityVerified: true, qualityReportId: 'qr4',
    batchId: 'FC-MYS-007', freshnessScore: 93, organic: false,
    description: 'Freshly harvested onions, ideal for everyday cooking. Uniform size, good shelf life.',
    visibility: 'both', createdDate: '2025-04-22', imageColor: '#8E44AD'
  },
  {
    id: 'p8', name: 'Coriander', category: 'Spices', farmerId: 'u6', farmerName: 'Kavitha',
    location: 'Shivamogga', quantity: 50, unit: 'kg', consumerPrice: 80, retailerBasePrice: 65,
    status: 'preorder', harvestDate: '2025-05-08', qualityVerified: false, qualityReportId: null,
    batchId: 'FC-SMG-008', freshnessScore: 0, organic: true,
    description: 'Fresh coriander leaves and seeds. Preorder now for harvest in 2 weeks.',
    visibility: 'both', createdDate: '2025-04-25', imageColor: '#27AE60'
  },
  {
    id: 'p9', name: 'Groundnut', category: 'Grains', farmerId: 'u5', farmerName: 'Manjunath',
    location: 'Haveri', quantity: 250, unit: 'kg', consumerPrice: 90, retailerBasePrice: 75,
    status: 'ready', harvestDate: '2025-04-19', qualityVerified: false, qualityReportId: null,
    batchId: 'FC-HVR-009', freshnessScore: 91, organic: true,
    description: 'Premium groundnuts, ideal for oil extraction or direct consumption.',
    visibility: 'retailer', createdDate: '2025-04-21', imageColor: '#A0522D'
  },
  {
    id: 'p10', name: 'Arecanut', category: 'Others', farmerId: 'u3', farmerName: 'Shobha Nayak',
    location: 'Mangaluru', quantity: 180, unit: 'kg', consumerPrice: 450, retailerBasePrice: 380,
    status: 'ready', harvestDate: '2025-04-17', qualityVerified: true, qualityReportId: 'qr5',
    batchId: 'FC-MNG-010', freshnessScore: 94, organic: false,
    description: 'Premium arecanut (betel nut) from coastal Karnataka. Well-dried, uniform grade.',
    visibility: 'retailer', createdDate: '2025-04-20', imageColor: '#D35400'
  },
];

export const orders: Order[] = [
  {
    id: 'FC-250420-001', userId: 'u7', userName: 'Priya Sharma', userRole: 'consumer',
    productId: 'p1', productName: 'Ragi', quantity: 5, totalAmount: 325,
    status: 'delivered', orderDate: '2025-04-20', expectedDelivery: '2025-04-22',
    farmerId: 'u1', farmerName: 'Ramesh Gowda', unit: 'kg'
  },
  {
    id: 'FC-250423-002', userId: 'u8', userName: 'Arun Kumar', userRole: 'consumer',
    productId: 'p4', productName: 'Turmeric', quantity: 2, totalAmount: 560,
    status: 'packed', orderDate: '2025-04-23', expectedDelivery: '2025-04-26',
    farmerId: 'u2', farmerName: 'Lakshmi Hegde', unit: 'kg'
  },
  {
    id: 'FC-250424-003', userId: 'u9', userName: 'FreshMart Retail', userRole: 'retailer',
    productId: 'p2', productName: 'Tomato', quantity: 50, totalAmount: 1400,
    status: 'accepted', orderDate: '2025-04-24', expectedDelivery: '2025-04-27',
    farmerId: 'u4', farmerName: 'Ravi Poojary', unit: 'kg'
  },
  {
    id: 'FC-250425-004', userId: 'u7', userName: 'Priya Sharma', userRole: 'consumer',
    productId: 'p7', productName: 'Onion', quantity: 10, totalAmount: 300,
    status: 'placed', orderDate: '2025-04-25', expectedDelivery: '2025-04-28',
    farmerId: 'u1', farmerName: 'Ramesh Gowda', unit: 'kg'
  },
];

export const auctions: Auction[] = [
  {
    id: 'a1', productId: 'p9', productName: 'Groundnut', farmerId: 'u5', farmerName: 'Manjunath',
    title: '250 kg Groundnut from Haveri', quantity: 250, unit: 'kg', location: 'Haveri',
    basePrice: 75, currentBid: 82, minIncrement: 2, bidCount: 4,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'live', winnerId: null, winnerName: null,
    description: 'Bulk lot of premium organic groundnuts. Direct from farm, no intermediaries.',
    imageColor: '#A0522D'
  },
  {
    id: 'a2', productId: 'p10', productName: 'Arecanut', farmerId: 'u3', farmerName: 'Shobha Nayak',
    title: '180 kg Arecanut from Mangaluru', quantity: 180, unit: 'kg', location: 'Mangaluru',
    basePrice: 380, currentBid: 410, minIncrement: 5, bidCount: 7,
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    status: 'closing_soon', winnerId: null, winnerName: null,
    description: 'Premium dried arecanut. Grade A quality from coastal Karnataka.',
    imageColor: '#D35400'
  },
  {
    id: 'a3', productId: 'p1', productName: 'Ragi', farmerId: 'u1', farmerName: 'Ramesh Gowda',
    title: '500 kg Organic Ragi from Mysuru', quantity: 500, unit: 'kg', location: 'Mysuru',
    basePrice: 55, currentBid: 58, minIncrement: 1, bidCount: 2,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'live', winnerId: null, winnerName: null,
    description: 'Bulk organic ragi. High nutritional value, ideal for retail packaging.',
    imageColor: '#8B6914'
  },
];

export const bids: Bid[] = [
  { id: 'b1', auctionId: 'a1', retailerId: 'u9', retailerName: 'FreshMart Retail', amount: 78, timestamp: '2025-04-25T08:00:00Z' },
  { id: 'b2', auctionId: 'a1', retailerId: 'u10', retailerName: 'Green Basket Wholesale', amount: 80, timestamp: '2025-04-25T09:30:00Z' },
  { id: 'b3', auctionId: 'a1', retailerId: 'u9', retailerName: 'FreshMart Retail', amount: 82, timestamp: '2025-04-25T10:15:00Z' },
  { id: 'b4', auctionId: 'a2', retailerId: 'u11', retailerName: 'Udupi Bulk Foods', amount: 395, timestamp: '2025-04-25T07:00:00Z' },
  { id: 'b5', auctionId: 'a2', retailerId: 'u10', retailerName: 'Green Basket Wholesale', amount: 405, timestamp: '2025-04-25T08:45:00Z' },
  { id: 'b6', auctionId: 'a2', retailerId: 'u11', retailerName: 'Udupi Bulk Foods', amount: 410, timestamp: '2025-04-25T11:00:00Z' },
];

export const qualityReports: QualityReport[] = [
  {
    id: 'qr1', productId: 'p1', productName: 'Ragi', batchId: 'FC-MYS-001',
    farmerId: 'u1', farmerName: 'Ramesh Gowda', grade: 'Premium', freshnessScore: 95,
    moisture: 8.2, pesticideResidue: 'Pass', inspectionDate: '2025-04-21',
    labName: 'AgriTest Labs, Mysuru', notes: 'Excellent quality. No pesticide detected. Organic certification verified.',
    status: 'verified'
  },
  {
    id: 'qr2', productId: 'p2', productName: 'Tomato', batchId: 'FC-UDP-002',
    farmerId: 'u4', farmerName: 'Ravi Poojary', grade: 'Standard', freshnessScore: 92,
    moisture: 92.5, pesticideResidue: 'Pass', inspectionDate: '2025-04-23',
    labName: 'Coastal Agri Labs, Udupi', notes: 'Good quality. Slight variation in size but within acceptable range.',
    status: 'verified'
  },
  {
    id: 'qr3', productId: 'p4', productName: 'Turmeric', batchId: 'FC-CMG-004',
    farmerId: 'u2', farmerName: 'Lakshmi Hegde', grade: 'Premium', freshnessScore: 96,
    moisture: 6.8, pesticideResidue: 'Pass', inspectionDate: '2025-04-19',
    labName: 'Hill Test Centre, Chikkamagaluru', notes: 'Exceptional quality. Curcumin content at 4.2%. No residue detected.',
    status: 'verified'
  },
  {
    id: 'qr4', productId: 'p7', productName: 'Onion', batchId: 'FC-MYS-007',
    farmerId: 'u1', farmerName: 'Ramesh Gowda', grade: 'Standard', freshnessScore: 93,
    moisture: 85.1, pesticideResidue: 'Pass', inspectionDate: '2025-04-22',
    labName: 'AgriTest Labs, Mysuru', notes: 'Fresh harvest. Good shelf life expected. Uniform grade.',
    status: 'verified'
  },
  {
    id: 'qr5', productId: 'p10', productName: 'Arecanut', batchId: 'FC-MNG-010',
    farmerId: 'u3', farmerName: 'Shobha Nayak', grade: 'Premium', freshnessScore: 94,
    moisture: 5.2, pesticideResidue: 'Pass', inspectionDate: '2025-04-18',
    labName: 'Coastal Quality Labs, Mangaluru', notes: 'Well-dried, uniform size. Export quality grade.',
    status: 'verified'
  },
  {
    id: 'qr6', productId: 'p3', productName: 'Coconut', batchId: 'FC-MNG-003',
    farmerId: 'u3', farmerName: 'Shobha Nayak', grade: 'Premium', freshnessScore: 0,
    moisture: 0, pesticideResidue: 'Pass', inspectionDate: '',
    labName: '', notes: 'Awaiting inspection scheduling.',
    status: 'pending'
  },
  {
    id: 'qr7', productId: 'p6', productName: 'Chilli', batchId: 'FC-HVR-006',
    farmerId: 'u5', farmerName: 'Manjunath', grade: '', freshnessScore: 0,
    moisture: 0, pesticideResidue: 'Pass', inspectionDate: '',
    labName: '', notes: 'Quality check requested. Awaiting lab assignment.',
    status: 'pending'
  },
];

export const conversations: Conversation[] = [
  {
    id: 'c1', participantIds: ['u7', 'u1'], participantNames: ['Priya Sharma', 'Ramesh Gowda'],
    lastMessage: 'Thank you! The ragi was excellent quality.',
    lastMessageTime: '2025-04-22T14:30:00Z', unreadCount: 0
  },
  {
    id: 'c2', participantIds: ['u7', 'u1'], participantNames: ['Priya Sharma', 'Ramesh Gowda'],
    lastMessage: 'Your order for Onion has been placed.',
    lastMessageTime: '2025-04-25T09:15:00Z', unreadCount: 1, productId: 'p7'
  },
  {
    id: 'c3', participantIds: ['u8', 'u2'], participantNames: ['Arun Kumar', 'Lakshmi Hegde'],
    lastMessage: 'Your turmeric order is being packed.',
    lastMessageTime: '2025-04-24T16:00:00Z', unreadCount: 0
  },
  {
    id: 'c4', participantIds: ['u9', 'u4'], participantNames: ['FreshMart Retail', 'Ravi Poojary'],
    lastMessage: 'Can you deliver by Friday? We need 50kg.',
    lastMessageTime: '2025-04-24T11:20:00Z', unreadCount: 2
  },
  {
    id: 'c5', participantIds: ['u10', 'u5'], participantNames: ['Green Basket Wholesale', 'Manjunath'],
    lastMessage: 'Bid placed for Groundnut auction.',
    lastMessageTime: '2025-04-25T09:30:00Z', unreadCount: 0
  },
];

export const messages: Message[] = [
  { id: 'm1', conversationId: 'c1', senderId: 'u7', senderName: 'Priya Sharma', content: 'Hi, is the organic ragi still available?', timestamp: '2025-04-20T10:00:00Z', isSystem: false },
  { id: 'm2', conversationId: 'c1', senderId: 'u1', senderName: 'Ramesh Gowda', content: 'Yes! Fresh harvest from last week. 500kg available.', timestamp: '2025-04-20T10:15:00Z', isSystem: false },
  { id: 'm3', conversationId: 'c1', senderId: 'system', senderName: 'System', content: 'Order FC-250420-001 has been delivered.', timestamp: '2025-04-22T14:00:00Z', isSystem: true },
  { id: 'm4', conversationId: 'c1', senderId: 'u7', senderName: 'Priya Sharma', content: 'Thank you! The ragi was excellent quality.', timestamp: '2025-04-22T14:30:00Z', isSystem: false },
  { id: 'm5', conversationId: 'c2', senderId: 'system', senderName: 'System', content: 'Your order for Onion has been placed.', timestamp: '2025-04-25T09:15:00Z', isSystem: true },
  { id: 'm6', conversationId: 'c3', senderId: 'system', senderName: 'System', content: 'Order FC-250423-002 is accepted.', timestamp: '2025-04-23T10:00:00Z', isSystem: true },
  { id: 'm7', conversationId: 'c3', senderId: 'system', senderName: 'System', content: 'Your turmeric order is being packed.', timestamp: '2025-04-24T16:00:00Z', isSystem: true },
  { id: 'm8', conversationId: 'c4', senderId: 'u9', senderName: 'FreshMart Retail', content: 'Can you deliver by Friday? We need 50kg.', timestamp: '2025-04-24T11:20:00Z', isSystem: false },
  { id: 'm9', conversationId: 'c5', senderId: 'system', senderName: 'System', content: 'Bid placed for Groundnut auction.', timestamp: '2025-04-25T09:30:00Z', isSystem: true },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'cp1', authorId: 'u1', authorName: 'Ramesh Gowda', authorRole: 'farmer',
    title: 'Ragi Mudde — The Traditional Way',
    content: 'Growing up in Mysuru, ragi mudde was a staple at every meal. Here is how my grandmother taught me to make it perfectly smooth without lumps. The secret is in the water temperature and constant stirring. Serve with sambar or curry for a wholesome meal.',
    tags: ['ragi', 'recipe', 'traditional', 'mysuru'], likes: 45, comments: 12,
    createdDate: '2025-04-20', type: 'recipe', imageColor: '#8B6914'
  },
  {
    id: 'cp2', authorId: 'u7', authorName: 'Priya Sharma', authorRole: 'consumer',
    title: 'Fresh Coconut Chutney in 5 Minutes',
    content: 'Just got fresh coconuts from Mangaluru through Agro Link. This chutney recipe is a game-changer — minimal ingredients, maximum flavor. You need fresh coconut, green chillies, ginger, and a tadka of mustard seeds and curry leaves.',
    tags: ['coconut', 'chutney', 'quick-recipe'], likes: 32, comments: 8,
    createdDate: '2025-04-22', type: 'recipe', imageColor: '#6B8E23'
  },
  {
    id: 'cp3', authorId: 'u2', authorName: 'Lakshmi Hegde', authorRole: 'farmer',
    title: 'Why I Switched to Organic Turmeric Farming',
    content: 'Five years ago, I decided to stop using chemical pesticides on my farm in Chikkamagaluru. The transition was challenging, but seeing the quality difference in my turmeric made it worthwhile. The curcumin levels are higher, and the color is unmatched.',
    tags: ['organic', 'turmeric', 'farming', 'sustainability'], likes: 67, comments: 23,
    createdDate: '2025-04-18', type: 'story', imageColor: '#DAA520'
  },
  {
    id: 'cp4', authorId: 'u4', authorName: 'Ravi Poojary', authorRole: 'farmer',
    title: 'Tomato Rasam with Farm-Fresh Tomatoes',
    content: 'Nothing beats the flavor of vine-ripened tomatoes in a rasam. Here is my family recipe — ripe tomatoes, tamarind, pepper, cumin, and garlic. The natural sweetness of fresh tomatoes makes all the difference.',
    tags: ['tomato', 'rasam', 'recipe', 'udupi'], likes: 28, comments: 6,
    createdDate: '2025-04-23', type: 'recipe', imageColor: '#E74C3C'
  },
  {
    id: 'cp5', authorId: 'u8', authorName: 'Arun Kumar', authorRole: 'consumer',
    title: 'Banana Stem — The Superfood You Are Ignoring',
    content: 'Banana stem is incredibly healthy — rich in fiber, aids digestion, and helps manage blood pressure. Here is a simple juice recipe: blend banana stem with yogurt, cumin, and salt. Drink it fresh for maximum benefits.',
    tags: ['banana', 'health', 'superfood', 'tips'], likes: 19, comments: 4,
    createdDate: '2025-04-24', type: 'tips', imageColor: '#F4D03F'
  },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u7', title: 'Order Delivered', message: 'Your Ragi order has been delivered.', read: true, timestamp: '2025-04-22T14:00:00Z', type: 'order' },
  { id: 'n2', userId: 'u7', title: 'Order Placed', message: 'Your Onion order is confirmed.', read: false, timestamp: '2025-04-25T09:15:00Z', type: 'order' },
  { id: 'n3', userId: 'u1', title: 'New Order', message: 'You have a new order from Priya Sharma.', read: false, timestamp: '2025-04-25T09:15:00Z', type: 'order' },
  { id: 'n4', userId: 'u2', title: 'Order Accepted', message: 'Your Turmeric order has been accepted.', read: true, timestamp: '2025-04-23T10:00:00Z', type: 'order' },
  { id: 'n5', userId: 'u4', title: 'New Order', message: 'FreshMart Retail placed a bulk order.', read: false, timestamp: '2025-04-24T11:00:00Z', type: 'order' },
];
