import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/auth";
import { mongooseConnect } from "@/app/lib/mongoose";
import { Category } from "@/models/category";

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            mesdage: "Unauthorized"
        });
    }

    try {
        const { name, parentCategory, image, description  } = await req.json();

        if (!name) {
            return NextResponse.json({
                status: 400,
                message: "Category name is required" 
            });
        }

        await mongooseConnect();

        if(!parentCategory || parentCategory === "none") {
            const category = await Category.create({ name, image, description });
            return NextResponse.json({
                status: 200,
                message: "Category added successfully", category
            });
        }

        const category = await Category.create({ 
            name,
            description,
            parentCategory: parentCategory,
            image
         });

        return NextResponse.json({
            status: 200,
            message: "Category added successfully", category
        });
    }
    catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({
            status: 500,
            message: "Error adding category"
        });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session?.user) {
        return NextResponse.json({
            status: 401,
            message: "Unauthorized"
        });
    }

    try {
        await mongooseConnect();
        const { id, name, parentCategory, description, image } = await req.json();
        console.log("description: ", description);  

        // If no parentCategory is provided, update only the name
        let updateData: any = { name, description, image };

        if (parentCategory) {
            updateData.parentCategory = parentCategory; // Add parentCategory field if parentCategory exists
        }

        // Update the category in the database
        const category = await Category.findByIdAndUpdate(
            id,   // Pass the id directly
            updateData,
            { new: true }  // Return the updated document
        );
        
        // If the category was not found
        if (!category) {
            return NextResponse.json({
                status: 404,
                message: "Category not found"
            });
        }
        console.log("UPDATED, ", category);
        // Successfully updated the category
        return NextResponse.json({
            status: 200,
            message: "Category updated successfully",
            category
        });
    }
    catch (error) {
        // Log and return error
        console.error("Error updating category: ", error);
        return NextResponse.json({
            status: 500,
            message: "Error updating category"
        });
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
        await mongooseConnect();

        const categories = await Category.find({});

        return NextResponse.json({
            status: 200,
            categories
        })
    }
    catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({
            status: 500,
            message: "Error connecting to MongoDB"
        });
    }
}


