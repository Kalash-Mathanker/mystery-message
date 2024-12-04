import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose, { mongo } from "mongoose";


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 },
      );
    }

    //user._id was in string in session so convert for aggregation it works fine in findOne(handled internally)
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            {$group: {_id: '$_id', messages: {$push: 'messages'}}}
        ])

        if (!user || user.length === 0) {
            return Response.json(
              {
                success: false,
                message: "User not found",
              },
              { status: 401 },
            );
        }

        return Response.json(
          {
            success: true,
            message: user[0].messages,
          },
          { status: 200 },
        );

    } catch (error) {
        console.log("Unexpected error getting messages ", error)
        return Response.json(
          {
            success: false,
            message: "Unexpected error getting messages",
          },
          { status: 404 },
        );
    }
}