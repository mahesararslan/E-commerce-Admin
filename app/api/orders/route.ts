import authOptions from "@/app/lib/auth";
import { mongooseConnect } from "@/app/lib/mongoose";
import { Order } from "@/models/order";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            message: "Unauthorized"
        },{
            status: 401
        });
    }

    try {
        await mongooseConnect();

        const orders = await Order.find({});

        return NextResponse.json({
            orders
        },{
            status: 200
        })
    }
    catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({
            message: "Error connecting to MongoDB"
        },{
            status: 500
        });
    }
}


export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session?.user) {
        return NextResponse.json({
            message: "Unauthorized"
        },{
            status: 401
        });
    }

    try {
        await mongooseConnect();
        const { orderId, orderStatus } = await req.json();
        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );

        return NextResponse.json({
            message: "Category updated successfully",
            order
        }, {
            status: 200
        });
    }
    catch (error) {
        // Log and return error
        console.error("Error updating category: ", error);
        return NextResponse.json({
            message: "Error updating category"
        },{
            status: 500
        });
    }
}