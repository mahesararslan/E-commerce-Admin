
import { mongooseConnect } from "@/app/lib/mongoose";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const data = await req.json();
    const { productName, price, productDescription } = data;
    console.log(data);
    try {
        await mongooseConnect();

        // Create a new product
        const product = await Product.create({
            name: productName,
            price,
            description: productDescription
        })

        return NextResponse.json({
            received: product,
            status: 200
        });
    }
    catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({
            message: "Error connecting to MongoDB",
            received: data,
            status: 500
        });
    }
}

export async function GET(req: NextRequest) {
    try {
        await mongooseConnect();

        const products = await Product.find({});

        return NextResponse.json(products);
    }
    catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({
            message: "Error connecting to MongoDB",
            status: 500
        });
    }
}