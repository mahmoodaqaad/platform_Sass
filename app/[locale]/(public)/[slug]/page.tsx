import { prisma } from "@/Tools/db";
import { notFound, redirect } from "next/navigation";
import ModernTemplate from "@/components/templates/ModernTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";

export default async function BusinessPublicPage({ params }: { params: { locale: string, slug: string } }) {
    const { slug, locale } = await params;

    const business = await prisma?.business?.findUnique({
        where: { slug },
        include: {
            services: true,
            sections: true
        }
    });

    if (!business) {
        notFound();
    }

    // Redirect if current locale doesn't match business default language
    if (business.defaultLanguage && business.defaultLanguage !== locale) {
        redirect(`/${business.defaultLanguage}/${slug}`);
    }

    // Determine which template to render based on business.templateId
    const TemplateComponent = business.templateId === "classic" ? ClassicTemplate : ModernTemplate;

    return (
        <TemplateComponent business={business} sections={business.sections || []} />
    );
}
