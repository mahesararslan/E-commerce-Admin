import { mongooseConnect } from "@/app/lib/mongoose";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/auth";

export async function POST(request: Request) {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            mesdage: "Unauthorized"
        });
    }

  try {
    const { productName, productDescription, price, images, stock, categoryId, isOnSale, salePrice } = await request.json()

    // Connect to MongoDB
    await mongooseConnect()

    let payload = {
      name: productName,
      description: productDescription,
      price: price,
      images: images,
      stock: stock,
      category: categoryId,
      isOnSale: isOnSale
    }

    if(isOnSale) { // @ts-ignore
      payload.salePrice = salePrice;
    }

    // Insert the new product into the database
    const product = await Product.create(payload);
    console.log('Product added:', product);
    return NextResponse.json({ message: 'Product added successfully', productId: product.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({
      status: 401,
      message: "Unauthorized"
    });
  }

  try {
    await mongooseConnect()
    const products = await Product.find()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
