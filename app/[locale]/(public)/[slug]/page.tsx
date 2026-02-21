import { prisma } from "@/Tools/db";
import { notFound } from "next/navigation";
import { HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default async function BusinessPublicPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const business = await prisma?.business?.findUnique({
        where: { slug },
        include: {
            services: true,
        }
    });

    if (!business) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Hero Section for Business */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-indigo-600/20 to-zinc-950 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />

                <div className="relative z-20 text-center px-6">
                    <div className="w-24 h-24 bg-zinc-900 rounded-3xl border border-white/10 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                        {business?.logo ? (
                            <Image src={business?.logo} alt={business?.name} className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                            <span className="text-4xl font-black text-indigo-500">{business?.name[0]}</span>
                        )}
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">{business?.name}</h1>
                    <div className="flex items-center justify-center gap-6 text-zinc-400 font-medium">
                        <span className="flex items-center gap-2"><HiOutlineLocationMarker /> {business?.address || "Location not set"}</span>
                        <span className="bg-indigo-600/10 text-indigo-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                            {business?.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-6xl mx-auto py-20 px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Our Services</h2>
                        <p className="text-zinc-500">Pick a service to start your booking.</p>
                    </div>
                    <div className="bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 flex">
                        <button className="px-6 py-2 bg-indigo-600 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">All</button>
                        <button className="px-6 py-2 text-zinc-500 text-sm font-bold hover:text-white transition-colors">Popular</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {business?.services?.map((service) => (
                        <div key={service.id} className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all group">
                            <h3 className="text-xl font-bold mb-4">{service.name}</h3>
                            <p className="text-zinc-500 text-sm line-clamp-2 mb-6">{service.description || "Professional service tailored to your needs."}</p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                        <HiOutlineClock /> {service.duration} MIN
                                    </div>
                                    <div className="text-2xl font-black text-indigo-400">
                                        ${service.price.toString()}
                                    </div>
                                </div>
                                <Button className="px-6! py-3! text-sm">Book</Button>
                            </div>
                        </div>
                    ))}
                    {business?.services.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-zinc-900/30 rounded-[3rem] border border-dashed border-zinc-800">
                            <p className="text-zinc-600 italic font-medium">No services listed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
