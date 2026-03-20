import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, FileText, XCircle } from "lucide-react";

export default async function StudentOrdersPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Mock data for Payment Orders (normally fetched from MongoDB PaymentOrder model)
  const myOrders = [
    {
      id: "ord_12345",
      courseName: "احتراف التحليل الموجي المطور",
      amount: 299,
      method: "usdt",
      status: "under_review", // pending_payment, proof_uploaded, under_review, activated, rejected
      date: "2024-05-15T14:30:00Z"
    },
    {
      id: "ord_67890",
      courseName: "الكلاسيكي المطور (Price Action Pro)",
      amount: 199,
      method: "bank_transfer",
      status: "activated",
      date: "2024-04-10T09:15:00Z"
    }
  ];

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case "pending_payment":
        return { text: "بانتظار الدفع", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: <Clock size={16} /> };
      case "proof_uploaded":
      case "under_review":
        return { text: "قيد المراجعة", color: "text-blue-500", bg: "bg-blue-500/10", icon: <FileText size={16} /> };
      case "activated":
        return { text: "مُفعل", color: "text-green-500", bg: "bg-green-500/10", icon: <CheckCircle size={16} /> };
      case "rejected":
        return { text: "مرفوض", color: "text-red-500", bg: "bg-red-500/10", icon: <XCircle size={16} /> };
      default:
        return { text: status, color: "text-foreground-muted", bg: "bg-surface", icon: <Clock size={16} /> };
    }
  };

  const getMethodDisplay = (method: string) => {
    switch(method) {
      case "usdt": return "USDT كريبتو";
      case "bank_transfer": return "تحويل بنكي";
      case "vodafone_cash": return "فودافون كاش";
      default: return method;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-surface-hover transition-colors">
            <ArrowRight size={20} className="text-foreground-muted" />
          </Link>
          <h1 className="text-3xl font-bold">طلبات <span className="text-primary">الدفع</span></h1>
        </div>

        <div className="bg-surface/30 p-1 rounded-3xl border border-surface">
          <div className="hidden md:grid grid-cols-5 gap-4 p-4 text-sm font-bold text-foreground-muted border-b border-surface/50 px-6">
            <div className="col-span-2">الكورس</div>
            <div>طريقة الدفع</div>
            <div>المبلغ</div>
            <div>الحالة</div>
          </div>

          <div className="divide-y divide-surface/50">
            {myOrders.length > 0 ? (
              myOrders.map(order => {
                const statusInfo = getStatusDisplay(order.status);
                
                return (
                  <div key={order.id} className="grid md:grid-cols-5 gap-4 p-6 items-center hover:bg-surface/20 transition-colors">
                    <div className="col-span-2">
                      <div className="font-bold text-sm md:text-base mb-1">{order.courseName}</div>
                      <div className="text-xs text-foreground-muted font-mono">{new Date(order.date).toLocaleDateString("ar-EG")}</div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="md:hidden text-foreground-muted mr-2">الطريقة:</span>
                      {getMethodDisplay(order.method)}
                    </div>
                    
                    <div className="font-mono text-primary font-bold">
                      <span className="md:hidden text-foreground-muted mr-2 font-sans font-normal">المبلغ:</span>
                      ${order.amount}
                    </div>
                    
                    <div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-foreground-muted p-6">
                لا توجد طلبات دفع سابقة.
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-black p-6 rounded-2xl border border-surface">
          <h3 className="flex items-center gap-2 font-bold mb-2">
            <Clock className="text-primary" size={20} /> ملاحظة هامة
          </h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            تتم مراجعة الطلبات التي تم رفع إثبات الدفع لها يدوياً من قبل الإدارة. في حال استغرق الطلب أكثر من 24 ساعة، يرجى التواصل مع الدعم الفني عبر صفحة "تواصل معنا" أو إرسال رسالة على تليجرام مع رقم الطلب.
          </p>
        </div>
      </div>
    </div>
  );
}
