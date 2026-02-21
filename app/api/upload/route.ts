import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a promise to handle the stream-like behavior or buffer
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "services", // Folder name in Cloudinary
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const uploadResult = result as { secure_url: string; public_id: string };

        return NextResponse.json({
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
    }
};
