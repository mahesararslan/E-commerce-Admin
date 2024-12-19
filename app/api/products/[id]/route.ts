import { mongooseConnect } from "@/app/lib/mongoose";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/auth";

// GET a single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            mesdage: "Unauthorized"
        });
    }

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

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            mesdage: "Unauthorized"
        });
    }

    const { id } = params;
    const data = await req.json();
    
    try {
        await mongooseConnect();

        // only add sale price if product is on sale
        let payload = {
            name: data.productName,
            description: data.productDescription,
            price: data.price,
            images: data.images,
            stock: data.stock,
            category: data.categoryId,
            isOnSale: data.isOnSale
        }

        if (data.isOnSale) { // @ts-ignore
            payload.salePrice = data.salePrice;
        }
        
        console.log("Reieved Request for id: ", id, data);
        const product = await Product.findByIdAndUpdate(id, payload, { new: true });

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
