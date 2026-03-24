import ExploreList from "@/components/ExploreList";
import Footer from "@/components/Footer";

export default function ExplorePage() {
    return (
        <main className="flex flex-col min-h-screen bg-black">
            <ExploreList />
            <Footer />
        </main>
    );
}
