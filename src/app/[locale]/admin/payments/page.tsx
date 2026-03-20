"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, Eye, Search, FileText, 
  CheckCircle, XCircle, X, TrendingUp, 
  Clock, DollarSign, Wallet, Building2, 
  Phone, AlertCircle, Filter, FilterX,
  MessageSquare, ChevronLeft, Calendar
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionNote, setRejectionNote] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'completed' | 'rejected') => {
    const actionAr = status === 'completed' ? 'تفعيل' : 'رفض';
    const note = rejectionNote[orderId] || "";
    
    if (!confirm(`هل أنت متأكد من ${actionAr} هذا الطلب؟`)) return;

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes: note }),
    });

    if (res.ok) {
      fetchOrders();
    } else {
      const err = await res.json();
      alert(err.message || "حدث خطأ أثناء تحديث الحالة");
    }
  };

  const stats = {
    pendingCount: orders.filter(o => o.status === 'pending').length,
    pendingAmount: orders.filter(o => o.status === 'pending').reduce((acc, o) => acc + (o.amount || 0), 0),
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + (o.amount || 0), 0),
    successRate: orders.length > 0 ? Math.round((orders.filter(o => o.status === 'completed').length / (orders.filter(o => o.status !== 'pending').length || 1)) * 100) : 0
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case "usdt": return <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner border border-green-500/20"><Wallet size={24} /></div>;
      case "bank": return <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner border border-blue-500/20"><Building2 size={24} /></div>;
      case "vodafone_cash": return <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner border border-red-500/20"><Phone size={24} /></div>;
      default: return <div className="w-12 h-12 rounded-xl bg-surface text-foreground-muted flex items-center justify-center shadow-inner border border-surface"><CreditCard size={24} /></div>;
    }
  };

  const getMethodName = (method: string) => {
    switch(method) {
      case "usdt": return "USDT TRC20";
      case "bank": return "Bank Transfer";
      case "vodafone_cash": return "Vodafone Cash";
      default: return method;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "all" || o.status === filter;
    const matchesSearch = o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="p-40 text-center space-y-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-foreground-muted font-black italic animate-pulse tracking-widest uppercase">Syncing Financial Records...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-surface/20 p-12 rounded-[3.5rem] border border-surface shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <div className="relative z-10 space-y-4 text-right md:text-left">
          <h1 className="text-5xl font-black italic tracking-tight leading-tight">المركز <span className="text-primary underline decoration-primary/30 underline-offset-8">المالي</span></h1>
          <p className="text-foreground-muted text-xl font-medium max-w-lg">مراجعة طلبات الاشتراك، التحقق من الإيصالات، وإدارة التدفقات النقدية للمنصة</p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface/30 p-2.5 rounded-[2rem] border border-surface backdrop-blur-md">
          {[
            { id: "all", label: "الكل", icon: FilterX },
            { id: "pending", label: "معلق", icon: Clock },
            { id: "completed", label: "ناجح", icon: CheckCircle },
            { id: "rejected", label: "مرفوض", icon: XCircle }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black transition-all duration-300 ${filter === item.id ? 'bg-primary text-background shadow-2xl scale-105' : 'text-foreground-muted hover:bg-surface/40 hover:text-foreground'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface/30 border border-surface p-8 rounded-[2.5rem] shadow-xl group hover:border-orange-500/50 transition-all">
          <div className="flex justify-between items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center"><Clock size={28} /></div>
            <span className="text-3xl font-black text-orange-500">{stats.pendingCount}</span>
          </div>
          <p className="font-bold text-foreground-muted text-lg opacity-70">طلبات قيد المراجعة</p>
          <p className="mt-1 font-black text-xl">${stats.pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-surface/30 border border-surface p-8 rounded-[2.5rem] shadow-xl group hover:border-green-500/50 transition-all">
          <div className="flex justify-between items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center"><TrendingUp size={28} /></div>
            <span className="text-3xl font-black text-green-500">${stats.totalRevenue.toLocaleString()}</span>
          </div>
          <p className="font-bold text-foreground-muted text-lg opacity-70">إجمالي الإيرادات</p>
          <p className="mt-1 font-black text-sm text-green-500/80">خالص المدفوعات المفعلة</p>
        </div>
        <div className="bg-surface/30 border border-surface p-8 rounded-[2.5rem] shadow-xl group hover:border-primary/50 transition-all">
          <div className="flex justify-between items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><CheckCircle size={28} /></div>
            <span className="text-3xl font-black text-primary">{stats.successRate}%</span>
          </div>
          <p className="font-bold text-foreground-muted text-lg opacity-70">نسبة القبول</p>
          <p className="mt-1 font-black text-sm text-primary/80">كفاءة معالجة الطلبات</p>
        </div>
        <div className="bg-surface/30 border border-surface p-8 rounded-[2.5rem] shadow-xl group hover:border-foreground/30 transition-all">
          <div className="flex justify-between items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-surface text-foreground flex items-center justify-center"><Search size={28} /></div>
            <span className="text-3xl font-black text-foreground">Filter</span>
          </div>
          <input 
            type="text" 
            placeholder="Search email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 border border-surface rounded-xl px-4 py-2 text-xs font-black outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 translate-y-0 group">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-40 bg-surface/10 border-4 border-dashed border-surface rounded-[4rem] text-center">
             <div className="w-24 h-24 bg-surface/30 rounded-3xl flex items-center justify-center mx-auto text-foreground-muted mb-8"><Search size={48} /></div>
             <h3 className="text-3xl font-black mb-2 opacity-50 italic uppercase tracking-tighter">All Records Clear</h3>
             <p className="text-foreground-muted text-lg">لا يوجد طلبات دفع تتطابق مع بحثك حالياً</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="relative group/card">
              <div className={`absolute inset-0 rounded-[3rem] transition-all duration-500 opacity-0 blur-2xl group-hover/card:opacity-10 ${order.status === 'pending' ? 'bg-orange-500' : 'bg-primary'}`}></div>
              <div className="relative bg-surface/40 border border-surface rounded-[3rem] overflow-hidden backdrop-blur-xl group-hover/card:border-primary/50 transition-all duration-500 shadow-2xl flex flex-col">
                
                {/* User Snapshot */}
                <div className="p-10 flex flex-col md:flex-row justify-between gap-6 border-b border-surface/50">
                   <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-surface border border-surface flex items-center justify-center text-primary font-black text-2xl shadow-inner group-hover/card:scale-110 transition-transform">
                          {order.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-surface flex items-center justify-center ${order.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'} text-background`}>
                           {order.status === 'pending' ? <Clock size={12} /> : <CheckCircle size={12} />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight">{order.user?.name}</h3>
                        <p className="text-xs text-foreground-muted font-mono tracking-tighter italic opacity-70" dir="ltr">{order.user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                           {getMethodIcon(order.paymentMethod)}
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted">{getMethodName(order.paymentMethod)}</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right md:min-w-[120px]">
                      <div className="text-3xl font-black text-primary mb-2 flex items-center justify-end gap-1">
                        <DollarSign size={24} className="opacity-40" />
                        {order.amount}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-foreground-muted opacity-50 leading-none">Order Amount</div>
                   </div>
                </div>

                {/* Info Slab */}
                <div className="p-10 space-y-6 flex-1 bg-surface/10">
                   <div className="flex justify-between items-center bg-surface/20 p-5 rounded-2xl border border-surface shadow-inner group/item hover:bg-surface/30 transition-all">
                      <div className="flex items-center gap-3 text-foreground-muted text-xs font-black uppercase italic tracking-widest">
                         <Wallet size={16} className="text-primary" /> المطلوب:
                      </div>
                      <span className="font-black text-lg text-primary text-right italic">{order.course?.title}</span>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface/20 p-4 rounded-2xl border border-surface text-center">
                         <div className="text-[10px] font-black uppercase text-foreground-muted mb-1 flex items-center justify-center gap-2"><Calendar size={12} /> Date</div>
                         <div className="font-mono text-xs font-bold" dir="ltr">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-surface/20 p-4 rounded-2xl border border-surface text-center">
                         <div className="text-[10px] font-black uppercase text-foreground-muted mb-1 flex items-center justify-center gap-2"><AlertCircle size={12} /> Status</div>
                         <div className={`text-[10px] font-black uppercase ${order.status === 'pending' ? 'text-orange-500' : order.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                            {order.status}
                         </div>
                      </div>
                   </div>

                   {/* Admin Notes Section */}
                   {order.status === 'pending' && (
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted flex items-center gap-2"><MessageSquare size={12} /> ملاحظات الرفض (إختياري)</label>
                        <textarea 
                          placeholder="اكتب سبب الرفض هنا..."
                          value={rejectionNote[order._id] || ""}
                          onChange={(e) => setRejectionNote({...rejectionNote, [order._id]: e.target.value})}
                          className="w-full bg-background border border-surface rounded-2xl p-4 text-sm font-bold resize-none outline-none focus:border-red-500/50 transition-all h-20"
                        />
                     </div>
                   )}

                   {order.adminNotes && (
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl italic text-[11px] text-red-500/70">
                         <strong>ملاحظة الإدارة:</strong> {order.adminNotes}
                      </div>
                   )}
                </div>

                {/* Footer Controls */}
                <div className="p-8 bg-surface/30 border-t border-surface flex items-center gap-4">
                   <button 
                      onClick={() => setSelectedImage(order.proofImage)}
                      className="flex-1 py-5 bg-surface hover:bg-surface-hover text-foreground-muted hover:text-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border border-surface shadow-sm group/btn"
                   >
                      <Eye size={18} className="group-hover/btn:scale-125 transition-transform" /> إثبات الدفع
                   </button>
                   
                   {order.status === 'pending' ? (
                     <>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'completed')}
                          className="flex-[1.5] py-5 bg-primary text-background hover:bg-primary-hover rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-[0_15px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95"
                        >
                          <CheckCircle size={18} /> تفعيل الكورس
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'rejected')}
                          className="p-5 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                          title="رفض المعاملة"
                        >
                          <XCircle size={20} />
                        </button>
                     </>
                   ) : (
                     <div className="flex-1 py-5 rounded-2xl border border-surface/50 border-dashed flex items-center justify-center text-[10px] font-black uppercase text-foreground-muted tracking-[0.3em] italic">
                        Archived Record
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Advanced Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/95 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto">
           <div className="fixed inset-0" onClick={() => setSelectedImage(null)}></div>
           
           <button 
            onClick={() => setSelectedImage(null)} 
            className="absolute top-10 left-10 p-5 bg-surface rounded-2xl text-foreground hover:rotate-90 transition-all z-[110] border border-surface shadow-2xl group"
           >
              <X size={32} className="group-hover:scale-110 transition-transform" />
           </button>

           <div className="relative w-full max-w-5xl flex flex-col md:flex-row gap-8 animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 z-10">
              <div className="flex-[2] bg-surface p-4 rounded-[3rem] border border-surface shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Proof" 
                  className="w-full h-auto max-h-[80vh] object-contain rounded-[2rem] cursor-zoom-in" 
                  onClick={(e) => {
                    const img = e.currentTarget;
                    if (img.style.maxHeight === 'none') {
                      img.style.maxHeight = '80vh';
                      img.style.cursor = 'zoom-in';
                    } else {
                      img.style.maxHeight = 'none';
                      img.style.cursor = 'zoom-out';
                    }
                  }}
                />
              </div>

              <div className="flex-1 space-y-8 text-right self-start sticky top-10">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black italic">إثبات <span className="text-primary italic">الدفع</span></h2>
                    <p className="text-foreground-muted text-lg leading-relaxed italic opacity-80 uppercase tracking-tight">Financial record verification Terminal</p>
                  </div>

                  <div className="bg-surface/50 border border-surface p-8 rounded-[2.5rem] space-y-4 shadow-xl backdrop-blur-md">
                     <div className="flex justify-between items-center border-b border-surface p-4">
                        <span className="text-foreground-muted text-xs font-black uppercase tracking-widest"><Calendar size={12} className="inline ml-2" /> Date</span>
                        <span className="font-mono text-xs">{new Date().toLocaleTimeString()}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-surface p-4">
                        <span className="text-foreground-muted text-xs font-black uppercase tracking-widest"><Search size={12} className="inline ml-2" /> Match ID</span>
                        <span className="font-mono text-xs opacity-50">TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                     </div>
                     <p className="text-[11px] text-foreground-muted/60 leading-relaxed italic pt-4">يرجى التأكد من مطابقة التاريخ والمبلغ في الصورة مع بيانات الطلب قبل التفعيل.</p>
                  </div>

                  <button 
                     onClick={() => setSelectedImage(null)}
                     className="w-full py-6 bg-primary text-background rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                  >
                     <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-transform" /> العودة للطلبات
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Embedded Styles */}
      <style jsx>{`
        .group:hover { transform: translateZ(0); }
        .transition-all { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}
