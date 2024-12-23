import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: "User already exists with this email"
          }, {status: 500})
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save();
            // jumps to send email from here
      }
        
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

      
    // Send verification mail
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    console.log("Email response: ", emailResponse);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Registered successfully, verify email",
      },
      {
        status: 200,
      },
    );
      
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      },
    );
  }
}
