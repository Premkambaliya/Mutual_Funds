// // "use client";
// // import React, { useEffect, useState } from 'react';
// // import SchemeCard from '@/components/SchemeCard';

// // function parseDateStr(d) {
// //   // MFAPI returns dd-mm-yyyy
// //   const parts = d.split('-');
// //   return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
// // }

// // function findNavOnOrBefore(navHistory, targetDate) {
// //   // navHistory expected sorted ascending (oldest -> newest)
// //   for (let i = navHistory.length - 1; i >= 0; i--) {
// //     const itemDate = parseDateStr(navHistory[i].date);
// //     if (itemDate <= targetDate) return navHistory[i];
// //   }
// //   return null;
// // }

// // function computeReturnsFromHistory(navHistory) {
// //   if (!navHistory || navHistory.length === 0) return null;
// //   // navHistory is expected newest-first or oldest-first? Our scheme API returns newest first in data; ensure sorted ascending by date
// //   const sorted = [...navHistory].map(h => ({ ...h })).sort((a, b) => parseDateStr(a.date) - parseDateStr(b.date));
// //   const last = sorted[sorted.length - 1];
// //   const endDate = parseDateStr(last.date);
// //   const getReturn = (days) => {
// //     const startDate = new Date(endDate);
// //     startDate.setDate(startDate.getDate() - days);
// //     const start = findNavOnOrBefore(sorted, startDate);
// //     if (!start) return null;
// //     const r = ((last.nav - start.nav) / start.nav) * 100;
// //     return r.toFixed(2);
// //   };
// //   return {
// //     '1D': getReturn(1),
// //     '1M': getReturn(30),
// //     '3M': getReturn(90),
// //     '6M': getReturn(180),
// //     '1Y': getReturn(365),
// //   };
// // }

// // export default function WatchlistPage() {
// //   const [items, setItems] = useState([]);
// //   const [details, setDetails] = useState({});

// //   useEffect(() => {
// //     fetch('/api/watchlist')
// //       .then(r => r.json())
// //       .then(data => setItems(data))
// //       .catch(err => console.error(err));
// //   }, []);

// //   useEffect(() => {
// //     // For each watchlist item fetch scheme nav history and compute returns
// //     const loadDetails = async () => {
// //       const map = {};
// //       await Promise.all(items.map(async item => {
// //         try {
// //           const res = await fetch(`/api/scheme/${item.scheme_code}`);
// //           if (!res.ok) return;
// //           const json = await res.json();
// //           // json.navHistory
// //           const perf = computeReturnsFromHistory(json.navHistory);
// //           map[item._id] = { meta: json.meta, perf };
// //         } catch (err) {
// //           console.error('scheme load', err);
// //         }
// //       }));
// //       setDetails(map);
// //     };
// //     if (items && items.length) loadDetails();
// //   }, [items]);

// //   return (
// //     <div style={{ padding: 24 }}>
// //       <h2>My Watchlist</h2>
// //       <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
// //         {items.map(item => {
// //           const d = details[item._id];
// //           return (
// //             <div key={`${item.scheme_code}-${item._id}`} style={{ border: '1px solid #E6E6E6', padding: 12, borderRadius: 8, background: '#fff' }}>
// //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                 <div>
// //                   <div style={{ fontWeight: 700, color: '#047857' }}>{d?.meta?.schemeName || `Scheme ${item.scheme_code}`}</div>
// //                   <div style={{ fontSize: 12, color: '#6B7280' }}>{d?.meta?.fundHouse || ''}</div>
// //                 </div>
// //                 <div>
// //                   <button
// //                     onClick={async () => {
// //                       if (!confirm('Remove this fund from your watchlist?')) return;
// //                       try {
// //                         const res = await fetch(`/api/watchlist?scheme_code=${item.scheme_code}`, { method: 'DELETE' });
// //                         if (!res.ok) throw new Error('Delete failed');
// //                         // refresh
// //                         const listRes = await fetch('/api/watchlist');
// //                         const newItems = await listRes.json();
// //                         setItems(newItems);
// //                         // clear details for deleted item
// //                         setDetails(prev => { const copy = {...prev}; delete copy[item._id]; return copy; });
// //                       } catch (err) {
// //                         console.error(err);
// //                         alert('Failed to remove from watchlist');
// //                       }
// //                     }}
// //                     style={{ background: 'transparent', border: '1px solid #F3F4F6', padding: '6px 10px', borderRadius: 6 }}
// //                   >
// //                     Remove
// //                   </button>
// //                 </div>
// //               </div>
// //               <div style={{ marginTop: 12 }}>
// //                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
// //                   <thead>
// //                     <tr>
// //                       <th style={{ textAlign: 'left', padding: '6px 4px' }}></th>
// //                       <th style={{ textAlign: 'right', padding: '6px 4px' }}>Change</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {d?.perf ? Object.entries(d.perf).map(([k,v]) => (
// //                       <tr key={k}>
// //                         <td style={{ padding: '6px 4px', color: '#374151' }}>{k}</td>
// //                         <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 700, color: v >= 0 ? '#059669' : '#DC2626' }}>{v !== null ? `${v}%` : 'N/A'}</td>
// //                       </tr>
// //                     )) : (
// //                       <tr><td colSpan={2} style={{ padding: '6px 4px' }}>Loading performance...</td></tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }



// "use client";
// import React, { useEffect, useState } from 'react';
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   Eye, 
//   Trash2, 
//   Plus,
//   Search,
//   Star,
//   RefreshCw,
//   ArrowUpRight,
//   ArrowDownRight,
//   Sparkles
// } from 'lucide-react';

// function parseDateStr(d) {
//   const parts = d.split('-');
//   return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
// }

// function findNavOnOrBefore(navHistory, targetDate) {
//   for (let i = navHistory.length - 1; i >= 0; i--) {
//     const itemDate = parseDateStr(navHistory[i].date);
//     if (itemDate <= targetDate) return navHistory[i];
//   }
//   return null;
// }

// function computeReturnsFromHistory(navHistory) {
//   if (!navHistory || navHistory.length === 0) return null;
//   const sorted = [...navHistory].map(h => ({ ...h })).sort((a, b) => parseDateStr(a.date) - parseDateStr(b.date));
//   const last = sorted[sorted.length - 1];
//   const endDate = parseDateStr(last.date);
//   const getReturn = (days) => {
//     const startDate = new Date(endDate);
//     startDate.setDate(startDate.getDate() - days);
//     const start = findNavOnOrBefore(sorted, startDate);
//     if (!start) return null;
//     const r = ((last.nav - start.nav) / start.nav) * 100;
//     return r.toFixed(2);
//   };
//   return {
//     '1D': getReturn(1),
//     '1M': getReturn(30),
//     '3M': getReturn(90),
//     '6M': getReturn(180),
//     '1Y': getReturn(365),
//   };
// }

// export default function WatchlistPage() {
//   const [items, setItems] = useState([]);
//   const [details, setDetails] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const loadWatchlist = async () => {
//     try {
//       const res = await fetch('/api/watchlist');
//       const data = await res.json();
//       setItems(data);
//     } catch (err) {
//       console.error('Error loading watchlist:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadWatchlist();
//   }, []);

//   useEffect(() => {
//     const loadDetails = async () => {
//       const map = {};
//       await Promise.all(items.map(async item => {
//         try {
//           const res = await fetch(`/api/scheme/${item.scheme_code}`);
//           if (!res.ok) return;
//           const json = await res.json();
//           const perf = computeReturnsFromHistory(json.navHistory);
//           map[item._id] = { meta: json.meta, perf, navHistory: json.navHistory };
//         } catch (err) {
//           console.error('Scheme load error:', err);
//         }
//       }));
//       setDetails(map);
//     };
//     if (items && items.length) loadDetails();
//   }, [items]);

//   const handleRemove = async (item) => {
//     if (!confirm(`Remove ${details[item._id]?.meta?.schemeName || 'this fund'} from watchlist?`)) return;
    
//     try {
//       const res = await fetch(`/api/watchlist?scheme_code=${item.scheme_code}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('Delete failed');
      
//       await loadWatchlist();
//       setDetails(prev => {
//         const copy = {...prev};
//         delete copy[item._id];
//         return copy;
//       });
//     } catch (err) {
//       console.error('Remove error:', err);
//       alert('Failed to remove from watchlist');
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadWatchlist();
//     setTimeout(() => setRefreshing(false), 1000);
//   };

//   const filteredItems = items.filter(item => {
//     if (!searchQuery.trim()) return true;
//     const d = details[item._id];
//     const schemeName = d?.meta?.schemeName?.toLowerCase() || '';
//     const fundHouse = d?.meta?.fundHouse?.toLowerCase() || '';
//     const query = searchQuery.toLowerCase();
//     return schemeName.includes(query) || fundHouse.includes(query);
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading your watchlist...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
//                   <Eye className="text-white" size={24} />
//                 </div>
//                 My Watchlist
//               </h1>
//               <p className="text-gray-600 mt-2 ml-15">
//                 Track performance of {items.length} mutual fund{items.length !== 1 ? 's' : ''}
//               </p>
//             </div>
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50"
//             >
//               <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>
//           </div>

//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search funds by name or fund house..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Empty State */}
//         {items.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Star className="text-emerald-600" size={40} />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Your watchlist is empty</h3>
//             <p className="text-gray-600 mb-6">Start adding mutual funds to track their performance</p>
//             <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
//               Browse Mutual Funds
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Funds Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {filteredItems.map(item => {
//                 const d = details[item._id];
//                 const latestNav = d?.navHistory?.[0]?.nav;
//                 const bestReturn = d?.perf ? Math.max(...Object.values(d.perf).filter(v => v !== null).map(v => parseFloat(v))) : null;
                
//                 return (
//                   <div 
//                     key={`${item.scheme_code}-${item._id}`}
//                     className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
//                   >
//                     {/* Card Header */}
//                     <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex-1">
//                           <h3 className="text-lg font-bold mb-1 line-clamp-2">
//                             {d?.meta?.schemeName || `Scheme ${item.scheme_code}`}
//                           </h3>
//                           <p className="text-emerald-100 text-sm">
//                             {d?.meta?.fundHouse || 'Loading...'}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleRemove(item)}
//                           className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors ml-2"
//                           title="Remove from watchlist"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
                      
//                       {latestNav && (
//                         <div className="flex items-baseline gap-2">
//                           <span className="text-3xl font-bold">₹{latestNav}</span>
//                           <span className="text-emerald-100 text-sm">Current NAV</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Performance Table */}
//                     <div className="p-6">
//                       {d?.perf ? (
//                         <>
//                           <div className="flex items-center justify-between mb-4">
//                             <h4 className="text-sm font-semibold text-gray-700">Performance Returns</h4>
//                             {bestReturn !== null && bestReturn > 0 && (
//                               <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
//                                 <Sparkles size={12} />
//                                 Best: {bestReturn}%
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="space-y-2">
//                             {Object.entries(d.perf).map(([period, value]) => {
//                               const isPositive = value >= 0;
//                               const isNull = value === null;
                              
//                               return (
//                                 <div 
//                                   key={period}
//                                   className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
//                                 >
//                                   <div className="flex items-center gap-2">
//                                     <div className={`w-2 h-2 rounded-full ${
//                                       isNull ? 'bg-gray-400' : isPositive ? 'bg-emerald-500' : 'bg-red-500'
//                                     }`}></div>
//                                     <span className="font-medium text-gray-700">{period}</span>
//                                   </div>
                                  
//                                   <div className="flex items-center gap-2">
//                                     {!isNull && (
//                                       <>
//                                         {isPositive ? (
//                                           <ArrowUpRight size={16} className="text-emerald-600" />
//                                         ) : (
//                                           <ArrowDownRight size={16} className="text-red-600" />
//                                         )}
//                                       </>
//                                     )}
//                                     <span className={`font-bold text-lg ${
//                                       isNull ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-600'
//                                     }`}>
//                                       {isNull ? 'N/A' : `${value > 0 ? '+' : ''}${value}%`}
//                                     </span>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </>
//                       ) : (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//                             <p className="text-gray-500 text-sm">Loading performance data...</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Card Footer */}
//                     <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                       <button className="w-full py-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 rounded-lg transition-colors">
//                         View Details
//                         <ArrowUpRight size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* No Results */}
//             {filteredItems.length === 0 && searchQuery && (
//               <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Search className="text-gray-400" size={32} />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No funds found</h3>
//                 <p className="text-gray-600">Try adjusting your search terms</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  Star,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [returnsData, setReturnsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const computeReturns = (navData) => {
    if (!navData || navData.length === 0) return null;

    const parsed = navData
      .map((d) => ({
        date: new Date(d.date.split("-").reverse().join("-")),
        nav: parseFloat(d.nav),
      }))
      .sort((a, b) => a.date - b.date);

    const lastDate = parsed[parsed.length - 1].date;

    const findNavOnOrBefore = (targetDate) => {
      for (let i = parsed.length - 1; i >= 0; i--) {
        if (parsed[i].date <= targetDate) return parsed[i];
      }
      return null;
    };

    const calcReturn = (months) => {
      const startDate = new Date(lastDate);
      startDate.setMonth(startDate.getMonth() - months);

      const startNav = findNavOnOrBefore(startDate);
      const endNav = parsed[parsed.length - 1];

      if (!startNav || !endNav) return null;
      const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
      return absReturn.toFixed(2);
    };

    const oneDay = () => {
      const startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() - 1);
      const startNav = findNavOnOrBefore(startDate);
      const endNav = parsed[parsed.length - 1];
      if (!startNav || !endNav) return null;
      const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
      return absReturn.toFixed(2);
    };

    return {
      "1D": oneDay(),
      "1M": calcReturn(1),
      "3M": calcReturn(3),
      "6M": calcReturn(6),
      "1Y": calcReturn(12),
    };
  };

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/watchlist", {
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
        throw new Error("Failed to fetch watchlist");
      }

      const data = await response.json();
      const funds = data.watchlist.funds || [];
      setWatchlist(funds);

      // Fetch returns for each fund
      const returnsPromises = funds.map(async (fund) => {
        try {
          const res = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
          if (!res.ok) return null;
          const fundData = await res.json();
          return { schemeCode: fund.schemeCode, returns: computeReturns(fundData.data) };
        } catch (err) {
          console.error(`Error fetching returns for ${fund.schemeCode}:`, err);
          return null;
        }
      });

      const returnsResults = await Promise.all(returnsPromises);
      const returnsMap = returnsResults.reduce((acc, curr) => {
        if (curr) acc[curr.schemeCode] = curr.returns;
        return acc;
      }, {});
      setReturnsData(returnsMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWatchlist();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const removeFromWatchlist = async (schemeCode, schemeName) => {
    if (!confirm(`Remove ${schemeName} from watchlist?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schemeCode }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to remove from watchlist");

      const data = await response.json();
      setWatchlist(data.watchlist.funds || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter watchlist based on search
  const filteredWatchlist = watchlist.filter(fund => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return fund.schemeName.toLowerCase().includes(query) || 
           fund.schemeCode.toString().includes(query);
  });

  // Modern Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-8 border-teal-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Your Watchlist</h3>
          <p className="text-gray-600">Fetching performance data...</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Eye className="text-white" size={24} />
                </div>
                My Watchlist
              </h1>
              <p className="text-gray-600 text-lg">
                Track performance of {watchlist.length} mutual fund{watchlist.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-emerald-400 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 font-medium"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search funds by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all"
            />
          </div>
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
              className="ml-auto text-red-600 hover:text-red-800 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your watchlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding mutual funds to track their performance</p>
            <button 
              onClick={() => router.push('/funds')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Browse Mutual Funds
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                      <th className="px-6 py-4 text-left text-sm font-bold">Fund Name</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">Code</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">1D</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">1M</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">3M</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">6M</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">1Y</th>
                      <th className="px-4 py-4 text-center text-sm font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWatchlist.map((fund, index) => {
                      const returns = returnsData[fund.schemeCode];
                      const bestReturn = returns ? Math.max(...Object.values(returns).filter(v => v !== null).map(v => parseFloat(v))) : null;
                      
                      return (
                        <tr 
                          key={fund.schemeCode}
                          className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                                {fund.schemeName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{fund.schemeName}</p>
                                {bestReturn !== null && bestReturn > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                                    <Sparkles size={12} />
                                    <span>Best: {bestReturn}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">
                            {fund.schemeCode}
                          </td>
                          {['1D', '1M', '3M', '6M', '1Y'].map((period) => {
                            const value = returns?.[period];
                            const isPositive = value >= 0;
                            const isNull = value === null;
                            
                            return (
                              <td key={period} className="px-4 py-4 text-center">
                                {isNull ? (
                                  <span className="text-gray-400 text-sm">N/A</span>
                                ) : (
                                  <div className="flex items-center justify-center gap-1">
                                    {isPositive ? (
                                      <ArrowUpRight size={14} className="text-emerald-600" />
                                    ) : (
                                      <ArrowDownRight size={14} className="text-red-600" />
                                    )}
                                    <span className={`font-bold text-sm ${
                                      isPositive ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                      {value > 0 ? '+' : ''}{value}%
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => removeFromWatchlist(fund.schemeCode, fund.schemeName)}
                              className="p-2 bg-red-50 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all hover:scale-110"
                              title="Remove from watchlist"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredWatchlist.map((fund) => {
                const returns = returnsData[fund.schemeCode];
                const bestReturn = returns ? Math.max(...Object.values(returns).filter(v => v !== null).map(v => parseFloat(v))) : null;
                
                return (
                  <div 
                    key={fund.schemeCode}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{fund.schemeName}</h3>
                          <p className="text-emerald-100 text-sm">Code: {fund.schemeCode}</p>
                        </div>
                        <button
                          onClick={() => removeFromWatchlist(fund.schemeCode, fund.schemeName)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {bestReturn !== null && bestReturn > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs font-medium w-fit">
                          <Sparkles size={12} />
                          <span>Best: {bestReturn}%</span>
                        </div>
                      )}
                    </div>

                    {/* Performance Data */}
                    <div className="p-4">
                      {returns ? (
                        <div className="space-y-2">
                          {Object.entries(returns).map(([period, value]) => {
                            const isPositive = value >= 0;
                            const isNull = value === null;
                            
                            return (
                              <div 
                                key={period}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                              >
                                <span className="font-medium text-gray-700">{period}</span>
                                <div className="flex items-center gap-2">
                                  {!isNull && (
                                    <>
                                      {isPositive ? (
                                        <ArrowUpRight size={16} className="text-emerald-600" />
                                      ) : (
                                        <ArrowDownRight size={16} className="text-red-600" />
                                      )}
                                    </>
                                  )}
                                  <span className={`font-bold ${
                                    isNull ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-600'
                                  }`}>
                                    {isNull ? 'N/A' : `${value > 0 ? '+' : ''}${value}%`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">Loading performance data...</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredWatchlist.length === 0 && searchQuery && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No funds found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}