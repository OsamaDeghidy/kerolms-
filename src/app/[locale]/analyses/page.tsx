import { getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAnalysesAction, getLiveAnalysisAction } from "@/app/actions/analysis";
import { auth } from "@/auth";
import AnalysesClient from "@/components/analyses/AnalysesClient";

export default async function AnalysesPage() {
  const session = await auth();
  const locale = await getLocale();
  const isRtl = locale === 'ar';
  
  // @ts-ignore
  const hasAccess = session?.user?.hasAnalysisAccess || session?.user?.role === "admin"; 

  // Fetch data on server
  const analyses = hasAccess ? await getAnalysesAction() : [];
  const liveAnalysis = hasAccess ? await getLiveAnalysisAction() : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
               {isRtl ? <>التحليلات <span className="text-primary italic">البريميوم</span></> : <>Premium <span className="text-primary italic">Analyses</span></>}
            </h1>
            <p className="text-foreground-muted text-lg font-medium">
              {isRtl ? 'تحليلات يومية حصرية لأسواق الكريبتو والفوركس' : 'Exclusive daily insights into Crypto and Forex markets'}
            </p>
          </div>

          <AnalysesClient 
            analyses={analyses} 
            liveAnalysis={liveAnalysis} 
            hasAccess={hasAccess} 
            isRtl={isRtl} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
