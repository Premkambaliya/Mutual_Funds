// "use client";
// import React, { useEffect, useState } from 'react';

// export default function VirtualPortfolioPage() {
//   const [portfolios, setPortfolios] = useState([]);
//     const [coin, setCoin] = useState(null);
//     const [buyAmount, setBuyAmount] = useState(1000);
//     const [sipForm, setSipForm] = useState({ scheme_code: '', amount: 1000, startDate: '', frequency: 'monthly' });
//     const [sipResults, setSipResults] = useState([]);

//   useEffect(() => {
//     fetch('/api/virtual-portfolio')
//       .then(r => r.json())
//       .then(data => setPortfolios(data))
//       .catch(err => console.error(err));
//     fetch('/api/virtual-coin')
//       .then(r => r.json())
//       .then(c => setCoin(c))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Virtual Portfolios</h2>
//       <div>
//           {coin && (
//             <div style={{ border: '1px solid #E6FFFA', padding: 12, marginBottom: 12, background: '#F0FFF4' }}>
//               <h3>{coin.symbol} (Demo Coin)</h3>
//               <div>Current Price: ₹{coin.current} (1 ₹ = 1 coin)</div>
//               <div style={{ marginTop: 8 }}>
//                 <label>Buy amount (₹): </label>
//                 <input type="number" value={buyAmount} onChange={e => setBuyAmount(Number(e.target.value))} style={{ width: 120, marginLeft: 8 }} />
//                 <button style={{ marginLeft: 12 }} onClick={async () => {
//                   try {
//                     // ensure portfolio
//                     let portfolio = portfolios && portfolios[0];
//                     if (!portfolio) {
//                       const createRes = await fetch('/api/virtual-portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'My Portfolio' }) });
//                       portfolio = await createRes.json();
//                       setPortfolios([portfolio]);
//                     }
//                     const units = buyAmount; // 1 Rs = 1 coin
//                     const patchRes = await fetch('/api/virtual-portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: portfolio._id, action: 'buyCoin', payload: { symbol: coin.symbol, units, price: coin.current } }) });
//                     const updated = await patchRes.json();
//                     setPortfolios([updated]);
//                     alert('Bought ' + units + ' coins for ₹' + buyAmount);
//                   } catch (err) {
//                     console.error(err);
//                     alert('Buy failed: ' + (err.message || ''));
//                   }
//                 }}>Buy</button>
//               </div>
//             </div>
//           )}

//           {portfolios.length === 0 && <div>No portfolios yet. Create one from the UI (TBD).</div>}
//           <div style={{ border: '1px solid #EEF2FF', padding: 12, marginBottom: 12, background: '#FBFBFF' }}>
//             <h3>Create Virtual SIP</h3>
//             <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//               <input placeholder="Scheme Code" value={sipForm.scheme_code} onChange={e => setSipForm({...sipForm, scheme_code: e.target.value})} />
//               <input type="number" placeholder="Amount (₹)" value={sipForm.amount} onChange={e => setSipForm({...sipForm, amount: Number(e.target.value)})} />
//               <input type="date" value={sipForm.startDate} onChange={e => setSipForm({...sipForm, startDate: e.target.value})} />
//               <select value={sipForm.frequency} onChange={e => setSipForm({...sipForm, frequency: e.target.value})}>
//                 <option value="monthly">Monthly</option>
//                 <option value="quarterly">Quarterly</option>
//                 <option value="yearly">Yearly</option>
//               </select>
//               <button onClick={async () => {
//                 try {
//                   if (!sipForm.scheme_code || !sipForm.startDate) return alert('Please enter scheme code and start date');
//                   // ensure portfolio
//                   let portfolio = portfolios && portfolios[0];
//                   if (!portfolio) {
//                     const createRes = await fetch('/api/virtual-portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'My Portfolio' }) });
//                     portfolio = await createRes.json();
//                     setPortfolios([portfolio]);
//                   }
//                   // add SIP via API (server will compute stats)
//                   const payload = { scheme_code: Number(sipForm.scheme_code), startDate: sipForm.startDate, amount: Number(sipForm.amount), frequency: sipForm.frequency };
//                   const patchRes = await fetch('/api/virtual-portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: portfolio._id, action: 'addSip', payload }) });
//                   const updated = await patchRes.json();
//                   setPortfolios([updated]);

//                   // if server returned computed sip on portfolio, display it
//                   const createdSip = updated.sips && updated.sips[updated.sips.length - 1];
//                   if (createdSip && createdSip.computed) {
//                     setSipResults([{ scheme: { schemeName: 'Scheme ' + createdSip.scheme_code }, totalUnits: createdSip.computed.totalUnits, currentValue: createdSip.computed.currentValue, invested: createdSip.computed.invested, roi: createdSip.computed.roi }]);
//                   }
//                 } catch (err) {
//                   console.error(err);
//                   alert('Failed to create SIP');
//                 }
//               }}>Create SIP</button>
//             </div>
//             {sipResults.length > 0 && (
//               <div style={{ marginTop: 12 }}>
//                 <h4>SIP Summary</h4>
//                 <div>Scheme: {sipResults[0].scheme.schemeName}</div>
//                 <div>Units accumulated: {sipResults[0].totalUnits.toFixed(6)}</div>
//                 <div>Current value: ₹{sipResults[0].currentValue.toFixed(2)}</div>
//                 <div>Invested: ₹{sipResults[0].invested}</div>
//                 <div>ROI: {(((sipResults[0].currentValue - sipResults[0].invested) / sipResults[0].invested) * 100).toFixed(2)}%</div>
//               </div>
//             )}
//           </div>
//           {portfolios.map(p => (
//             <div key={p._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }}>
//               <h3>{p.name}</h3>
//               <div>Cash: ₹{p.cash}</div>
//               {p.portfolioSummary && (
//                 <div style={{ marginTop: 8, padding: 8, background: '#FFF8F0', border: '1px solid #FFEFD5' }}>
//                   <div>Total Invested: ₹{p.portfolioSummary.totalInvested.toFixed(2)}</div>
//                   <div>Total Current Value: ₹{p.portfolioSummary.totalCurrentValue.toFixed(2)}</div>
//                   <div>Total ROI: {p.portfolioSummary.totalROI.toFixed(2)}%</div>
//                 </div>
//               )}
//               <div>SIPs: {p.sips?.length || 0}</div>
//               {p.sips && p.sips.length > 0 && (
//                 <div style={{ marginTop: 8 }}>
//                   <h4>SIP Positions</h4>
//                   {p.sips.map((s, idx) => (
//                     <div key={idx} style={{ border: '1px solid #f0f0f0', padding: 8, marginBottom: 8 }}>
//                       <div>Scheme Code: {s.scheme_code}</div>
//                       <div>Start Date: {new Date(s.startDate).toLocaleDateString()}</div>
//                       <div>Amount: ₹{s.amount} ({s.frequency})</div>
//                       {s.computed ? (
//                         <div style={{ marginTop: 6 }}>
//                           <div>Units: {s.computed.totalUnits.toFixed(6)}</div>
//                           <div>Invested: ₹{s.computed.invested}</div>
//                           <div>Current Value: ₹{s.computed.currentValue.toFixed(2)}</div>
//                           <div>ROI: {s.computed.roi.toFixed(2)}%</div>
//                           <details style={{ marginTop: 6 }}>
//                             <summary>Installment history ({s.computed.installmentRecords.length})</summary>
//                             <div style={{ maxHeight: 200, overflow: 'auto', padding: 6 }}>
//                               {s.computed.installmentRecords.map((it, i) => (
//                                 <div key={i}>{it.date}: units {it.units.toFixed(6)} @ ₹{it.nav}</div>
//                               ))}
//                             </div>
//                           </details>
//                         </div>
//                       ) : <div>No computed data</div>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <div>
//                 <h4>Coin Holdings</h4>
//                 {p.coins && p.coins.length ? p.coins.map(c => (
//                   <div key={c.symbol}>{c.symbol}: {c.units} coins</div>
//                 )) : <div>No coins held</div>}
//               </div>
//               <div>
//                 <h4>Transactions</h4>
//                 {p.transactions && p.transactions.length ? p.transactions.slice().reverse().map(t => (
//                   <div key={t._id}>{new Date(t.date).toLocaleString()}: {t.type} {t.units || ''} {t.symbol || ''} for ₹{t.amount}</div>
//                 )) : <div>No transactions</div>}
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  AlertCircle
} from "lucide-react";

export default function VirtualPortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/virtual-portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch portfolios");
        }

        const data = await response.json();
        setPortfolios(data.portfolios || []);
        if (data.portfolios.length > 0) {
          setSelectedPortfolio(data.portfolios[0].name);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [router]);

  const createPortfolio = async () => {
    if (!newPortfolioName.trim()) {
      setError("Portfolio name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/virtual-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolioName: newPortfolioName }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to create portfolio");

      const data = await response.json();
      setPortfolios(data.portfolios || []);
      setSelectedPortfolio(newPortfolioName);
      setNewPortfolioName("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeInvestment = async (portfolioName, investmentId) => {
    if (!confirm("Are you sure you want to remove this investment?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/virtual-portfolio", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolioName, investmentId }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to remove investment");

      const data = await response.json();
      setPortfolios(data.portfolios || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePortfolio = async (portfolioName) => {
    if (!confirm(`Are you sure you want to delete "${portfolioName}"? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/virtual-portfolio", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolioName }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to delete portfolio");

      const data = await response.json();
      setPortfolios(data.portfolios || []);
      if (data.portfolios.length > 0) {
        setSelectedPortfolio(data.portfolios[0].name);
      } else {
        setSelectedPortfolio("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Modern Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <Wallet className="absolute inset-0 m-auto text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Your Portfolios</h3>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  const currentPortfolio = portfolios.find(p => p.name === selectedPortfolio);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Wallet size={40} className="text-emerald-600" />
            Virtual Portfolios
          </h1>
          <p className="text-gray-600 text-lg">
            Practice investing with virtual money
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Portfolio Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="text-emerald-600" size={24} />
            Create New Portfolio
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter portfolio name (e.g., Growth Portfolio)"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createPortfolio()}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button
              onClick={createPortfolio}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create Portfolio
            </button>
          </div>
        </div>

        {/* No Portfolios State */}
        {portfolios.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Portfolios Yet</h3>
            <p className="text-gray-600 mb-6">Create your first virtual portfolio to start practicing investments</p>
          </div>
        ) : (
          <>
            {/* Portfolio Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Portfolio
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedPortfolio}
                  onChange={(e) => setSelectedPortfolio(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white cursor-pointer font-medium transition-all"
                >
                  {portfolios.map((portfolio) => (
                    <option key={portfolio.name} value={portfolio.name}>
                      {portfolio.name} ({portfolio.investments?.length || 0} investments)
                    </option>
                  ))}
                </select>
                {selectedPortfolio && (
                  <button
                    onClick={() => deletePortfolio(selectedPortfolio)}
                    className="px-6 py-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Portfolio Details */}
            {selectedPortfolio && currentPortfolio && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                {/* Portfolio Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">{selectedPortfolio}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 size={18} />
                        <span className="text-xs text-emerald-100">Total Investments</span>
                      </div>
                      <p className="text-2xl font-bold">{currentPortfolio.investments?.length || 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target size={18} />
                        <span className="text-xs text-emerald-100">Portfolio Value</span>
                      </div>
                      <p className="text-2xl font-bold">
                        ₹{currentPortfolio.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={18} />
                        <span className="text-xs text-emerald-100">Active SIPs</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {currentPortfolio.investments?.filter(inv => inv.type === 'SIP').length || 0}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign size={18} />
                        <span className="text-xs text-emerald-100">Lumpsum</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {currentPortfolio.investments?.filter(inv => inv.type === 'Lumpsum').length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Investments List */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="text-emerald-600" size={24} />
                    Your Investments
                  </h3>

                  {!currentPortfolio.investments || currentPortfolio.investments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-600 mb-4">No investments yet in this portfolio</p>
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                        Add Your First Investment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentPortfolio.investments.map((inv) => {
                        const isProfit = Math.random() > 0.5;
                        const profitPercent = (Math.random() * 30 - 10).toFixed(2);
                        
                        return (
                          <div
                            key={inv._id}
                            className="border-2 border-gray-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                      {inv.schemeName}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(inv.date).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </span>
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        inv.type === 'SIP' 
                                          ? 'bg-blue-100 text-blue-700' 
                                          : 'bg-purple-100 text-purple-700'
                                      }`}>
                                        {inv.type}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
                                    isProfit 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    <span>{profitPercent}%</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Amount Invested</p>
                                    <p className="font-bold text-gray-900">
                                      ₹{inv.amount?.toLocaleString('en-IN') || '0'}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Current Value</p>
                                    <p className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                                      ₹{((inv.amount || 0) * (1 + parseFloat(profitPercent) / 100)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Returns</p>
                                    <p className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                                      ₹{((inv.amount || 0) * parseFloat(profitPercent) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => removeInvestment(selectedPortfolio, inv._id)}
                                className="self-start sm:self-center p-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all group-hover:scale-110"
                                title="Remove investment"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Portfolio Footer */}
                <div className="bg-gray-50 border-t-2 border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
                      <p className="text-3xl font-bold text-emerald-600">
                        ₹{currentPortfolio.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2">
                      <Plus size={20} />
                      Add Investment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}