import { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { useApp } from '../store';
import type { Auction, Bid } from '../types';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

export default function AuctionsSection() {
  const { state } = useApp();
  if (state.currentRole === 'retailer') return <RetailerAuctions />;
  if (state.currentRole === 'farmer') return <FarmerAuctions />;
  return <GeneralAuctions />;
}

function RetailerAuctions() {
  const { state } = useApp();
  const liveAuctions = state.auctions.filter(a => a.status === 'live' || a.status === 'closing_soon');

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Live Auctions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {liveAuctions.map(auction => (
          <AuctionDetailCard key={auction.id} auction={auction} />
        ))}
      </div>
      {liveAuctions.length === 0 && <EmptyState icon="gavel" title="No live auctions" description="Check back later for new auction lots." />}
    </div>
  );
}

function AuctionDetailCard({ auction }: { auction: Auction }) {
  const { state, dispatch } = useApp();
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minIncrement);
  const myBids = state.bids.filter((b: Bid) => b.auctionId === auction.id && b.retailerId === 'u9');
  const isHighestBidder = myBids.length > 0 && myBids[myBids.length - 1].amount === auction.currentBid;
  const auctionBids = state.bids.filter((b: Bid) => b.auctionId === auction.id);

  const timeLeft = Math.max(0, new Date(auction.endTime).getTime() - Date.now());
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: auction.imageColor }}>
          {auction.productName[0]}
        </div>
        <Badge variant={auction.status === 'closing_soon' ? 'auction-closing' : 'auction-live'}>
          {auction.status === 'closing_soon' ? 'Closing Soon' : 'Live'}
        </Badge>
      </div>

      <h4 className="font-semibold text-slate-800 mb-1">{auction.title}</h4>
      <p className="text-xs text-slate-400 mb-3">{auction.farmerName} &middot; <MapPin className="w-3 h-3 inline" />{auction.location}</p>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold text-green-700">Rs.{auction.currentBid}</span>
        <span className="text-xs text-slate-400">/ {auction.unit}</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{auction.bidCount} bids &middot; Min increment: Rs.{auction.minIncrement}</p>

      <div className="flex items-center gap-2 text-sm mb-4 p-2 bg-slate-50 rounded-lg">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-slate-600 font-medium">{hours}h {minutes}m remaining</span>
      </div>

      {isHighestBidder && (
        <div className="p-2 bg-green-50 border border-green-200 rounded-lg mb-3 text-sm text-green-700 font-medium text-center">
          You are the highest bidder!
        </div>
      )}

      {/* Bid history */}
      {auctionBids.length > 0 && (
        <div className="mb-4 max-h-32 overflow-y-auto">
          <p className="text-xs text-slate-400 mb-1">Bid History</p>
          {auctionBids.slice().reverse().map((bid: Bid) => (
            <div key={bid.id} className="flex justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-600">{bid.retailerName}</span>
              <span className="font-medium text-slate-800">Rs.{bid.amount}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          value={bidAmount}
          onChange={e => setBidAmount(Number(e.target.value))}
          min={auction.currentBid + auction.minIncrement}
          className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
        />
        <button
          onClick={() => {
            if (bidAmount < auction.currentBid + auction.minIncrement) {
              dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `Bid must be at least Rs.${auction.currentBid + auction.minIncrement}`, type: 'error' } });
              return;
            }
            dispatch({ type: 'PLACE_BID', payload: {
              id: Math.random().toString(36).substring(2, 10),
              auctionId: auction.id,
              retailerId: 'u9',
              retailerName: 'FreshMart Retail',
              amount: bidAmount,
              timestamp: new Date().toISOString(),
            }});
            dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: 'Bid placed successfully!', type: 'success' } });
            setBidAmount(bidAmount + auction.minIncrement);
          }}
          className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 active:scale-95 transition-all"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
}

function FarmerAuctions() {
  const { state } = useApp();
  const myAuctions = state.auctions.filter(a => a.farmerId === state.currentUser.id);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">My Auctions</h2>
      </div>
      {myAuctions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myAuctions.map(auction => (
            <div key={auction.id} className="bg-white rounded-xl border border-slate-100 p-5">
              <h4 className="font-semibold text-slate-800">{auction.title}</h4>
              <p className="text-2xl font-bold text-green-700 mt-2">Rs.{auction.currentBid}<span className="text-xs text-slate-400 font-normal">/ {auction.unit}</span></p>
              <p className="text-xs text-slate-400 mt-1">{auction.bidCount} bids</p>
              <Badge variant={auction.status === 'closing_soon' ? 'auction-closing' : 'auction-live'}>
                {auction.status === 'closing_soon' ? 'Closing Soon' : 'Live'}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="gavel" title="No auctions yet" description="Create your first auction lot to sell in bulk." />
      )}
    </div>
  );
}

function GeneralAuctions() {
  const { state } = useApp();

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Auctions</h2>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Lot</th>
                <th className="text-left px-4 py-3 font-medium">Farmer</th>
                <th className="text-left px-4 py-3 font-medium">Current Bid</th>
                <th className="text-left px-4 py-3 font-medium">Bids</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {state.auctions.map(auction => (
                <tr key={auction.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{auction.title}</td>
                  <td className="px-4 py-3 text-slate-500">{auction.farmerName}</td>
                  <td className="px-4 py-3 font-bold text-green-700">Rs.{auction.currentBid}</td>
                  <td className="px-4 py-3 text-slate-500">{auction.bidCount}</td>
                  <td className="px-4 py-3"><Badge variant={auction.status === 'closing_soon' ? 'auction-closing' : 'auction-live'}>{auction.status === 'closing_soon' ? 'Closing' : 'Live'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
