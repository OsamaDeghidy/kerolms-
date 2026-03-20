import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Enrollment from "@/models/Enrollment";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const session = await auth();
    
    // Only admins can update orders
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { status, adminNotes } = await req.json();
    
    if (!["completed", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ message: "Order is already processed" }, { status: 400 });
    }

    order.status = status;
    order.adminNotes = adminNotes || "";
    
    if (status === "completed") {
      order.activatedAt = new Date();
      
      // Create Enrollment for the user
      try {
        await Enrollment.create({
          user: order.user,
          course: order.course,
          status: "active"
        });
      } catch (e: any) {
        // If enrollment already exists, just ignore
        if (e.code !== 11000) throw e;
      }
    }

    await order.save();
    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Admin Order Update Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
