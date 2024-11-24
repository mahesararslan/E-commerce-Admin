import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/auth";
import { mongooseConnect } from "@/app/lib/mongoose";
import { Category } from "@/models/category";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            message: "Unauthorized"
        });
    }

    try {
        console.log("Deleting category");
        console.log(params);
        const { id } = params;
        console.log(id);
        await mongooseConnect();

        const category = await Category.findByIdAndDelete(id);

        return NextResponse.json({
            status: 200,
            message: "Category deleted successfully",
            category
        });
    }
    catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({
            status: 500,
            message: "Error connecting to MongoDB"
        });
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized"
            });
        }
    
        try {
            console.log("Fetching category");
            console.log(params);
            const { id } = params;
            console.log(id);
            await mongooseConnect();
    
            const category = await Category.findById(id);
    
            return NextResponse.json({
                status: 200,
                message: "Category fetched successfully",
                category
            });
        }
        catch (error) {
            console.error("Error: ", error);
            return NextResponse.json({
                status: 500,
                message: "Error connecting to MongoDB"
            });
        }
}