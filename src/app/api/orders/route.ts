import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, amount, paymentMethod, proofImage, transactionId } = body;

    if (!courseId || !amount || !paymentMethod || !proofImage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.create({
      // @ts-ignore
      user: session.user.id,
      course: courseId,
      amount,
      paymentMethod,
      proofImage, // This is expected to be a URL or Base64 for now
      transactionId,
      status: "pending"
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("Order Creation Error:", err);
    return NextResponse.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Students can only see their own orders
    // @ts-ignore
    const orders = await Order.find({ user: session.user.id })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
