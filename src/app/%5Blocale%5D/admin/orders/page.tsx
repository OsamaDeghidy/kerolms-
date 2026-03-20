"use client";

import { useState, useEffect } from "react";
import { Check, X, Eye, Clock, User, Book, DollarSign, Image as ImageIcon } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId: string, status: "completed" | "rejected") => {
    setProcessingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      } else {
        alert("خطأ في تحديث الحالة");
      }
    } catch (err) {
      alert("خطأ في الاتصال");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">جاري تحميل الطلبات...</div>;

  const pendingOrders = orders.filter(o => o.status === "pending");
  const processedOrders = orders.filter(o => o.status !== "pending");

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic">إدارة <span className="text-primary">طلبات الدفع</span></h1>
          <p className="text-foreground-muted text-sm mt-1 font-medium">راجع الحوالات وقم بتفعيل الكورسات للطلاب</p>
        </div>
        <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm">
          {pendingOrders.length} طلبات معلقة
        </div>
      </div>

      {/* Pending Orders Section */}
      <section className="space-y-6">
         <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
            <Clock size={20} /> الطلبات الجديدة (تحت المراجعة)
         </h2>
         
         <div className="grid gap-6">
            {pendingOrders.map((order) => (
              <div key={order._id} className="bg-surface/30 border-2 border-surface rounded-[2rem] p-8 flex flex-wrap gap-8 items-center group hover:border-primary/20 transition-all shadow-lg hover:shadow-primary/5">
                 <div className="flex-1 min-w-[250px] space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                          <User size={24} />
                       </div>
                       <div>
                          <h3 className="font-black text-lg leading-tight">{order.user?.name}</h3>
                          <p className="text-xs text-foreground-muted font-bold italic">{order.user?.email} • {order.user?.phone}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm font-bold">
                       <span className="flex items-center gap-2 text-foreground-muted bg-surface/50 px-3 py-1 rounded-lg">
                          <Book size={16} className="text-primary" /> {order.course?.title}
                       </span>
                       <span className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1 rounded-lg">
                          <DollarSign size={16} /> {order.amount}$
                       </span>
                       <span className="text-[10px] uppercase tracking-widest text-foreground-muted bg-background px-2 py-1 rounded-md border border-surface">
                          {order.paymentMethod}
                       </span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedImage(order.proofImage)}
                      className="flex flex-col items-center gap-1 group/btn"
                    >
                       <div className="w-16 h-16 rounded-2xl bg-background border-2 border-surface flex items-center justify-center overflow-hidden group-hover/btn:border-primary transition-all">
                          {order.proofImage ? (
                             <img src={order.proofImage} alt="Proof" className="w-full h-full object-cover group-hover/btn:scale-110 transition-transform" />
                          ) : (
                             <ImageIcon className="text-foreground-muted" />
                          )}
                       </div>
                       <span className="text-[10px] font-black text-foreground-muted group-hover/btn:text-primary uppercase">رؤية الإثبات</span>
                    </button>

                    <div className="h-12 w-[1px] bg-surface mx-4 hidden md:block"></div>

                    <div className="flex gap-3">
                       <button 
                         disabled={processingId === order._id}
                         onClick={() => handleAction(order._id, "completed")}
                         className="px-6 py-3 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 transition-all flex items-center gap-2 shadow-xl shadow-green-500/20 disabled:opacity-50"
                       >
                          <Check size={20} /> تفعيل
                       </button>
                       <button 
                         disabled={processingId === order._id}
                         onClick={() => handleAction(order._id, "rejected")}
                         className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                       >
                          <X size={20} /> رفض
                       </button>
                    </div>
                 </div>
              </div>
            ))}
            {pendingOrders.length === 0 && (
               <div className="text-center py-20 bg-surface/10 rounded-3xl border border-dashed border-surface text-foreground-muted italic font-medium">
                  لا توجد طلبات معلقة حالياً.
               </div>
            )}
         </div>
      </section>

      {/* Processed Orders Section */}
      <section className="space-y-6 opacity-80 pt-10 border-t border-surface">
         <h2 className="text-xl font-bold flex items-center gap-2 text-foreground-muted italic">
            <Check size={20} /> الطلبات المكتملة أو المرفوضة
         </h2>
         <div className="overflow-x-auto rounded-[2rem] border border-surface bg-surface/10 shadow-inner">
            <table className="w-full text-right border-collapse">
               <thead>
                  <tr className="bg-surface/30 border-b border-surface">
                     <th className="px-6 py-4 text-xs font-black uppercase text-foreground-muted">الطالب</th>
                     <th className="px-6 py-4 text-xs font-black uppercase text-foreground-muted">الدورة</th>
                     <th className="px-6 py-4 text-xs font-black uppercase text-foreground-muted">المبلغ</th>
                     <th className="px-6 py-4 text-xs font-black uppercase text-foreground-muted">التاريخ</th>
                     <th className="px-6 py-4 text-xs font-black uppercase text-foreground-muted">الحالة</th>
                  </tr>
               </thead>
               <tbody>
                  {processedOrders.map((order) => (
                     <tr key={order._id} className="border-b border-surface/30 hover:bg-surface/20 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold">{order.user?.name}</div>
                           <div className="text-[10px] text-foreground-muted">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold">{order.course?.title}</td>
                        <td className="px-6 py-4 font-black text-primary">${order.amount}</td>
                        <td className="px-6 py-4 text-xs font-medium">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                              {order.status === 'completed' ? 'تم التفعيل' : 'مرفوض'}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
            <div className="max-w-4xl max-h-[90vh] relative group" onClick={(e) => e.stopPropagation()}>
               <img src={selectedImage} alt="Payment Proof" className="max-w-full max-h-full rounded-2xl shadow-2xl border-2 border-white/10" />
               <button 
                 onClick={() => setSelectedImage(null)}
                 className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-black italic"
               >
                  <X size={24} /> إغلاق العرض
               </button>
            </div>
         </div>
      )}
    </div>
  );
}
