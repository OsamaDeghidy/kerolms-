"use client";

import { useEffect, useState } from "react";
import { 
  Plus, Search, Calendar, Clock, Video, 
  Trash2, Edit, TrendingUp, TrendingDown, 
  Target, ShieldAlert, BarChart3, CheckCircle2,
  XCircle, AlertCircle, Filter, Eye, ExternalLink, X
} from "lucide-react";

export default function AdminAnalysesPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"| "active" | "win" | "loss">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    symbol: "BTC/USD",
    direction: "buy",
    entryPrice: "",
    targetPrice: "",
    stopLoss: "",
    type: "crypto",
    status: "active",
    chartUrl: "",
    description: "",
    isLive: false
  });

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analyses");
      if (res.ok) setAnalyses(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/analyses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchAnalyses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التحليل؟")) return;
    const res = await fetch(`/api/admin/analyses/${id}`, { method: "DELETE" });
    if (res.ok) fetchAnalyses();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/admin/analyses/${editingItem._id}` : "/api/admin/analyses";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchAnalyses();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      symbol: "BTC/USD",
      direction: "buy",
      entryPrice: "",
      targetPrice: "",
      stopLoss: "",
      type: "crypto",
      status: "active",
      chartUrl: "",
      description: "",
      isLive: false
    });
  };

  const filteredAnalyses = analyses.filter(a => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const stats = {
    total: analyses.length,
    active: analyses.filter(a => a.status === 'active').length,
    winRate: analyses.length > 0 ? Math.round((analyses.filter(a => a.status === 'win').length / (analyses.filter(a => a.status !== 'active').length || 1)) * 100) : 0
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-surface/20 p-10 rounded-[3rem] border border-surface shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tight leading-tight">غرفة <span className="text-primary italic underline decoration-primary/30 underline-offset-8">التحليلات الذكية</span></h1>
          <p className="text-foreground-muted mt-4 text-xl font-medium max-w-lg">إدارة توصيات التداول ومتابعة الأداء اللحظي للسوق بكل احترافية</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingItem(null); setShowModal(true); }}
          className="group relative z-10 flex items-center gap-4 px-10 py-5 rounded-2xl bg-primary text-background font-black text-xl hover:bg-primary-hover transition-all shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)] hover:scale-105 active:scale-95"
        >
          <Plus size={28} className="group-hover:rotate-180 transition-transform duration-500" />
          بث تحليل جديد
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface/30 border border-surface p-8 rounded-[2rem] shadow-xl group hover:border-primary/50 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><BarChart3 size={28} /></div>
            <span className="text-4xl font-black text-primary">{stats.total}</span>
          </div>
          <p className="mt-6 font-bold text-foreground-muted text-lg tracking-wide uppercase opacity-70">إجمالي التحليلات</p>
        </div>
        <div className="bg-surface/30 border border-surface p-8 rounded-[2rem] shadow-xl group hover:border-green-500/50 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center"><TrendingUp size={28} /></div>
            <span className="text-4xl font-black text-green-500">{stats.active}</span>
          </div>
          <p className="mt-6 font-bold text-foreground-muted text-lg tracking-wide uppercase opacity-70">توصيات قائمة</p>
        </div>
        <div className="bg-surface/30 border border-surface p-8 rounded-[2rem] shadow-xl group hover:border-yellow-500/50 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center"><CheckCircle2 size={28} /></div>
            <span className="text-4xl font-black text-yellow-500">{stats.winRate}%</span>
          </div>
          <p className="mt-6 font-bold text-foreground-muted text-lg tracking-wide uppercase opacity-70">نسبة النجاح (Win Rate)</p>
        </div>
        <div className="bg-surface/30 border border-surface p-8 rounded-[2rem] shadow-xl group hover:border-foreground/30 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-14 h-14 rounded-2xl bg-surface text-foreground flex items-center justify-center"><Eye size={28} /></div>
            <span className="text-4xl font-black text-foreground">Live</span>
          </div>
          <p className="mt-6 font-bold text-foreground-muted text-lg tracking-wide uppercase opacity-70">وضع المراقبة</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-surface/20 p-2.5 rounded-[1.5rem] border border-surface w-fit backdrop-blur-md">
          {[
            { id: "all", label: "الجميع", icon: Filter },
            { id: "active", label: "نشط", icon: TrendingUp },
            { id: "win", label: "ناجح (TP)", icon: CheckCircle2 },
            { id: "loss", label: "خاسر (SL)", icon: XCircle }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`flex items-center gap-2.5 px-7 py-3 rounded-2xl font-black transition-all duration-300 ${filter === item.id ? 'bg-primary text-background shadow-2xl scale-105' : 'text-foreground-muted hover:bg-surface/40 hover:text-foreground'}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Grid */}
      {loading ? (
        <div className="py-40 text-center">
          <div className="w-20 h-20 border-8 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]"></div>
          <p className="text-foreground-muted text-xl font-black animate-pulse tracking-widest uppercase">Syncing with Market Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnalyses.length === 0 ? (
            <div className="col-span-full bg-surface/10 border-4 border-dashed border-surface rounded-[4rem] p-32 text-center group transition-all hover:bg-surface/20">
              <div className="w-24 h-24 bg-surface/30 rounded-3xl flex items-center justify-center mx-auto text-foreground-muted group-hover:scale-110 transition-transform duration-500 mb-8"><Search size={48} /></div>
              <h3 className="text-3xl font-black mb-2">لا يوجد تحليلات تطابق الفلتر</h3>
              <p className="text-foreground-muted text-lg">ابدأ ببث أول تحليل للسوق الآن</p>
            </div>
          ) : (
            filteredAnalyses.map((item) => (
              <div key={item._id} className="relative group perspective-1000">
                <div className={`absolute inset-0 rounded-[2.5rem] transition-all duration-500 opacity-20 blur-2xl group-hover:opacity-40 ${item.direction === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="relative h-full bg-surface/40 border border-surface rounded-[2.5rem] overflow-hidden backdrop-blur-xl group-hover:border-primary/50 transition-all duration-500 shadow-2xl flex flex-col">
                  
                  {/* Card Header: Direction & Symbol */}
                  <div className={`p-6 flex items-center justify-between border-b border-surface/50 ${item.direction === 'buy' ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.direction === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'} shadow-lg`}>
                        {item.direction === 'buy' ? <TrendingUp size={30} /> : <TrendingDown size={30} />}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight">{item.symbol}</h4>
                        <span className={`text-xs font-black uppercase tracking-[0.2em] ${item.direction === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                          {item.direction === 'buy' ? 'Bullish Setup' : 'Bearish Setup'}
                        </span>
                      </div>
                    </div>
                    {item.isLive && (
                      <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black border border-red-500/20 animate-pulse tracking-[0.1em]">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> LIVE
                      </span>
                    )}
                  </div>

                  {/* Card Image / Chart */}
                  <div className="aspect-video relative group/img overflow-hidden bg-surface flex items-center justify-center border-b border-surface/50">
                    {item.chartUrl ? (
                      <img src={item.chartUrl} alt="Chart" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                    ) : (
                      <BarChart3 size={48} className="text-foreground-muted opacity-20" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-xl font-black leading-tight text-white">{item.title}</h3>
                    </div>
                  </div>

                  {/* Signal Data: Entry/TP/SL */}
                  <div className="p-8 space-y-6 flex-1 bg-surface/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface/50 p-4 rounded-2xl border border-surface shadow-inner group/data hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-2 text-foreground-muted text-[10px] font-black uppercase tracking-widest mb-1">
                          <Target size={12} className="text-primary" /> Entry Price
                        </div>
                        <span className="text-lg font-black font-mono">{item.entryPrice || 'Market'}</span>
                      </div>
                      <div className="bg-surface/50 p-4 rounded-2xl border border-surface shadow-inner group/data hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-2 text-foreground-muted text-[10px] font-black uppercase tracking-widest mb-1">
                          <ShieldAlert size={12} className="text-red-500" /> Stop Loss
                        </div>
                        <span className="text-lg font-black font-mono text-red-500">{item.stopLoss || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-primary/10 p-5 rounded-2xl border border-green-500/20 shadow-inner group/data hover:border-green-500/40 transition-all">
                        <div className="flex items-center gap-2 text-foreground-muted text-[10px] font-black uppercase tracking-widest mb-2">
                          <CheckCircle2 size={12} className="text-green-500" /> Targets (Take Profits)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(item.targetPrice || "").split(',').map((tp: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-xs font-black font-mono ring-1 ring-green-500/30">
                              TP{i+1}: {tp.trim()}
                            </span>
                          ))}
                        </div>
                    </div>
                  </div>

                  {/* Card Controls: Status Management */}
                  <div className="p-6 bg-surface/50 border-t border-surface flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-background/50 px-2 py-2 rounded-xl border border-surface">
                       {[
                         { id: 'win', icon: CheckCircle2, color: 'hover:text-green-500 hover:bg-green-500/10', label: 'Win' },
                         { id: 'loss', icon: XCircle, color: 'hover:text-red-500 hover:bg-red-500/10', label: 'Loss' },
                         { id: 'active', icon: TrendingUp, color: 'hover:text-blue-500 hover:bg-blue-500/10', label: 'Reset' }
                       ].map((status) => (
                         <button
                           key={status.id}
                           onClick={() => handleStatusUpdate(item._id, status.id)}
                           className={`p-2.5 rounded-lg transition-all ${item.status === status.id ? 'bg-primary text-background shadow-lg' : 'text-foreground-muted'} ${status.color}`}
                           title={status.label}
                         >
                           <status.icon size={18} />
                         </button>
                       ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            title: item.title,
                            symbol: item.symbol,
                            direction: item.direction,
                            entryPrice: item.entryPrice || "",
                            targetPrice: item.targetPrice || "",
                            stopLoss: item.stopLoss || "",
                            type: item.type,
                            status: item.status,
                            chartUrl: item.chartUrl || "",
                            description: item.description || "",
                            isLive: item.isLive || false
                          });
                          setShowModal(true);
                        }}
                        className="p-3 bg-surface hover:bg-primary/20 hover:text-primary rounded-xl transition-all text-foreground-muted border border-surface"
                      >
                         <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-3 bg-surface hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all text-foreground-muted border border-surface"
                      >
                         <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Enhanced Analysis Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-background/95 backdrop-blur-2xl animate-in fade-in duration-500 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-surface border border-surface w-full max-w-4xl rounded-[3.5rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 z-10 border-t-primary/20">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-10 left-10 p-4 bg-surface/50 hover:bg-surface rounded-2xl text-foreground-muted hover:text-foreground transition-all border border-surface shadow-lg group"
            >
              <X size={28} className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="mb-12 space-y-3">
              <h2 className="text-4xl font-black tracking-tight">{editingItem ? "تعديل تحليل السوق" : "بث تحليل جديد للسوق"}</h2>
              <p className="text-foreground-muted text-lg font-medium italic opacity-80 flex items-center gap-2">
                <AlertCircle size={18} className="text-primary" /> املأ بيانات الصفقة بدقة ليتمكن الطلاب من المتابعة
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 text-right overflow-y-auto max-h-[70vh] px-2 pb-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">رمز الزوج / السهم</label>
                    <input 
                      type="text" required placeholder="مثلاً: BTC/USD أو GOLD"
                      value={formData.symbol} onChange={(e) => setFormData({...formData, symbol: e.target.value})} 
                      className="w-full bg-background/50 border-2 border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-xl font-black uppercase tracking-tight placeholder:opacity-30" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">عنوان التحليل</label>
                    <input 
                      type="text" required placeholder="مثلاً: كسر نموذج القمة المزدوجة"
                      value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="w-full bg-background/50 border-2 border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-lg font-bold" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">الاتجاه</label>
                      <div className="flex p-1.5 bg-background/50 rounded-2xl border-2 border-surface shadow-inner">
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, direction: 'buy'})}
                          className={`flex-1 py-3 rounded-xl font-black text-sm uppercase transition-all ${formData.direction === 'buy' ? 'bg-green-500 text-background shadow-lg' : 'text-foreground-muted hover:bg-surface'}`}
                        >
                          Buy / long
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, direction: 'sell'})}
                          className={`flex-1 py-3 rounded-xl font-black text-sm uppercase transition-all ${formData.direction === 'sell' ? 'bg-red-500 text-background shadow-lg' : 'text-foreground-muted hover:bg-surface'}`}
                        >
                          Sell / short
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">سوق التداول</label>
                      <select 
                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} 
                        className="w-full bg-background/50 border-2 border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-black uppercase appearance-none"
                      >
                        <option value="crypto">Crypto</option>
                        <option value="forex">Forex</option>
                        <option value="stocks">Stocks</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Levels */}
                <div className="space-y-6 bg-surface/20 p-8 rounded-[2.5rem] border border-surface shadow-inner">
                   <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">سعر الدخول (Entry)</label>
                    <input type="text" placeholder="مثلاً: 63,450" value={formData.entryPrice} onChange={(e) => setFormData({...formData, entryPrice: e.target.value})} className="w-full bg-background border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-mono font-bold" />
                  </div>
                   <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-green-500/70">الأهداف (Separated by comma)</label>
                    <input type="text" placeholder="مثلاً: 65000, 68000, 72000" value={formData.targetPrice} onChange={(e) => setFormData({...formData, targetPrice: e.target.value})} className="w-full bg-background border border-green-500/20 rounded-2xl px-6 py-4 outline-none focus:border-green-500 transition-all font-mono font-bold text-green-500" />
                  </div>
                   <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-red-500/70">وقف الخسارة (Stop Loss)</label>
                    <input type="text" placeholder="مثلاً: 61,000" value={formData.stopLoss} onChange={(e) => setFormData({...formData, stopLoss: e.target.value})} className="w-full bg-background border border-red-500/20 rounded-2xl px-6 py-4 outline-none focus:border-red-500 transition-all font-mono font-bold text-red-500" />
                  </div>
                </div>
              </div>

              {/* Extra Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">رابط الشارت (Chart Image URL)</label>
                    <div className="relative group">
                      <BarChart3 className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="url" placeholder="https://tradingview.com/x/..."
                        value={formData.chartUrl} onChange={(e) => setFormData({...formData, chartUrl: e.target.value})} 
                        className="w-full bg-background/50 border-2 border-surface rounded-2xl pr-14 pl-6 py-4 outline-none focus:border-primary transition-all font-mono text-sm" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-8 bg-surface/30 p-6 rounded-2xl border border-surface h-fit self-end">
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, isLive: !formData.isLive})}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm uppercase transition-all shadow-lg ${formData.isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-surface/50 text-foreground-muted'}`}
                    >
                      <Video size={18} />
                      Mark as LIVE
                    </button>
                    <div className="text-xs font-bold text-foreground-muted leading-relaxed italic">عند التفعيل، سيظهر تنبيه "مباشر الآن" للطلاب على موقع التحليلات.</div>
                  </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted">وصف التحليل / ملاحظات إضافية</label>
                <textarea 
                  rows={4} placeholder="اكتب تفاصيل إضافية عن الصفقة أو أسباب الدخول..."
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-background/50 border-2 border-surface rounded-3xl px-8 py-6 outline-none focus:border-primary transition-all text-lg font-bold resize-none shadow-inner" 
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 pt-8">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-6 rounded-[2rem] bg-surface hover:bg-surface-hover text-foreground font-black text-xl transition-all border-2 border-surface group"
                >
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">تجاهل التغييرات</span>
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-6 rounded-[2rem] bg-primary text-background font-black text-2xl hover:bg-primary-hover transition-all shadow-[0_20px_60px_-10px_rgba(var(--primary-rgb),0.4)] hover:scale-105 active:scale-95"
                >
                   {editingItem ? "تحديث التحليل" : "تأكيد البث للسوق"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles for Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--primary-rgb), 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--primary-rgb), 0.3); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}
