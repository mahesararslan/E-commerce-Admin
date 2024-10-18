import { mongooseConnect } from "@/app/lib/mongoose";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const { productName, productDescription, price, images } = await request.json()

    // Connect to MongoDB
    await mongooseConnect()

    // Create a new product document
    const newProduct = {
      name: productName,
      description: productDescription,
      price: price,
      images: images,
    }

    // Insert the new product into the database
    const product = await Product.create(newProduct)
    console.log('Product added:', product);
    return NextResponse.json({ message: 'Product added successfully', productId: product.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
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