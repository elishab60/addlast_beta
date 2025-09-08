import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProposePairForm from "@/components/ProposePairForm";

export default function ProposePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <ProposePairForm />
            </main>
            <Footer />
        </div>
    );
}
