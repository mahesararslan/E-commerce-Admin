import { mongooseConnect } from "@/app/lib/mongoose";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            mesdage: "Unauthorized"
        });
    }

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

