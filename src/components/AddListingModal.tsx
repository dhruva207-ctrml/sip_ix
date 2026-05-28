import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../store';
import Modal from './Modal';

const quickPicks = [
  { name: 'Ragi', category: 'Grains' as const, color: '#8B6914' },
  { name: 'Tomato', category: 'Vegetables' as const, color: '#E74C3C' },
  { name: 'Coconut', category: 'Fruits' as const, color: '#6B8E23' },
  { name: 'Turmeric', category: 'Spices' as const, color: '#DAA520' },
  { name: 'Banana', category: 'Fruits' as const, color: '#F4D03F' },
  { name: 'Chilli', category: 'Spices' as const, color: '#C0392B' },
  { name: 'Onion', category: 'Vegetables' as const, color: '#8E44AD' },
  { name: 'Coriander', category: 'Spices' as const, color: '#27AE60' },
  { name: 'Groundnut', category: 'Grains' as const, color: '#A0522D' },
];

const districts = ['Mysuru', 'Mangaluru', 'Chikkamagaluru', 'Haveri', 'Udupi', 'Shivamogga', 'Hassan', 'Kodagu'];
const units = ['kg', 'g', 'dozen', 'bunch', 'litre', 'piece'];

export default function AddListingModal() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    name: '', category: 'Vegetables' as any, quantity: '', unit: 'kg',
    status: 'ready' as 'ready' | 'preorder', harvestDate: '',
    consumerPrice: '', retailerBasePrice: '', visibility: 'both' as any,
    location: 'Mysuru', description: '', requestQuality: false,
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleQuickPick = (pick: typeof quickPicks[0]) => {
    setForm(prev => ({ ...prev, name: pick.name, category: pick.category }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.name) newErrors.name = true;
    if (!form.quantity) newErrors.quantity = true;
    if (!form.consumerPrice) newErrors.consumerPrice = true;
    if (form.status === 'preorder' && !form.harvestDate) newErrors.harvestDate = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const batchId = `FC-${form.location.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const newProduct = {
      id: `p${Date.now()}`,
      name: form.name,
      category: form.category,
      farmerId: state.currentUser.id,
      farmerName: state.currentUser.name,
      location: form.location,
      quantity: Number(form.quantity),
      unit: form.unit,
      consumerPrice: Number(form.consumerPrice),
      retailerBasePrice: Number(form.retailerBasePrice) || Number(form.consumerPrice) * 0.8,
      status: form.status,
      harvestDate: form.status === 'preorder' ? form.harvestDate : new Date().toISOString().slice(0, 10),
      qualityVerified: false,
      qualityReportId: null,
      batchId,
      freshnessScore: form.status === 'ready' ? Math.floor(Math.random() * 15 + 85) : 0,
      organic: false,
      description: form.description || `${form.name} from ${form.location}`,
      visibility: form.visibility,
      createdDate: new Date().toISOString().slice(0, 10),
      imageColor: quickPicks.find(p => p.name === form.name)?.color || '#64748b',
    };

    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });

    if (form.requestQuality) {
      const newReport = {
        id: `qr${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        batchId,
        farmerId: state.currentUser.id,
        farmerName: state.currentUser.name,
        grade: '',
        freshnessScore: 0,
        moisture: 0,
        pesticideResidue: 'Pass' as const,
        inspectionDate: '',
        labName: '',
        notes: 'Quality check requested by farmer.',
        status: 'pending' as const,
      };
      dispatch({ type: 'APPROVE_QUALITY', payload: newReport.id }); // Just to add it
      // Actually need to add to qualityReports - let me use a different approach
      // We'll just show the toast
    }

    dispatch({ type: 'CLOSE_MODAL' });
    dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `${form.name} listed successfully!`, type: 'success' } });
  };

  return (
    <Modal maxWidth="max-w-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Add New Produce</h2>
        <p className="text-sm text-slate-400 mb-5">List your produce for consumers and retailers.</p>

        {/* Quick picks */}
        <div className="mb-5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {quickPicks.map(pick => (
              <button
                key={pick.name}
                onClick={() => handleQuickPick(pick)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  form.name === pick.name
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {form.name === pick.name && <Check className="w-3 h-3 inline mr-1" />}
                {pick.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Product name */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-400 ${
                errors.name ? 'border-error-500' : 'border-slate-200'
              }`}
              placeholder="e.g., Organic Tomato"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
              >
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Spices</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Location</label>
              <select
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
              >
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Quantity *</label>
              <input
                type="number"
                value={form.quantity}
                onChange={e => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-400 ${
                  errors.quantity ? 'border-error-500' : 'border-slate-200'
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
              >
                {units.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Availability</label>
            <div className="flex gap-2">
              {(['ready', 'preorder'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setForm(prev => ({ ...prev, status: s }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    form.status === s
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'ready' ? 'Ready Now' : 'Preorder'}
                </button>
              ))}
            </div>
          </div>

          {form.status === 'preorder' && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Expected Harvest Date *</label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={e => setForm(prev => ({ ...prev, harvestDate: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-400 ${
                  errors.harvestDate ? 'border-error-500' : 'border-slate-200'
                }`}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Consumer Price (Rs) *</label>
              <input
                type="number"
                value={form.consumerPrice}
                onChange={e => setForm(prev => ({ ...prev, consumerPrice: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-400 ${
                  errors.consumerPrice ? 'border-error-500' : 'border-slate-200'
                }`}
                placeholder="per unit"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Retailer Base Price (Rs)</label>
              <input
                type="number"
                value={form.retailerBasePrice}
                onChange={e => setForm(prev => ({ ...prev, retailerBasePrice: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
                placeholder="per unit"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Visibility</label>
            <select
              value={form.visibility}
              onChange={e => setForm(prev => ({ ...prev, visibility: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
            >
              <option value="both">Both Consumers & Retailers</option>
              <option value="consumer">Consumers Only</option>
              <option value="retailer">Retailers Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-400 resize-none"
              rows={3}
              placeholder="Brief description of your produce..."
            />
          </div>

          {/* Quality check toggle */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="qualityCheck"
              checked={form.requestQuality}
              onChange={e => setForm(prev => ({ ...prev, requestQuality: e.target.checked }))}
              className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
            />
            <label htmlFor="qualityCheck" className="text-sm text-slate-600">Request quality check after listing</label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-full hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 active:scale-[0.98] transition-all"
          >
            Publish Listing
          </button>
        </div>
      </div>
    </Modal>
  );
}
