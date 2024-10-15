import { mongooseConnect } from "@/app/lib/mongoose";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

// GET a single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        await mongooseConnect();

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: "Product not found", status: 401 });
        }

        return NextResponse.json({product, status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ message: "Error fetching product", status: 500 });
    }
}

// PUT (update) a product by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await req.json();
    
    try {
        await mongooseConnect();

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        if (!product) {
            return NextResponse.json({ message: "Product not found", status: 401 });
        }

        return NextResponse.json({product, status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ message: "Error updating product", status: 500 });
    }
}

// DELETE a product by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        await mongooseConnect();

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully", status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ message: "Error deleting product", status: 500 });
    }
}
