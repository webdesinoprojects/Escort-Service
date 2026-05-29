import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { createClient } from "@/server/db/supabase";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("Missing ImageKit environment variables");
      return NextResponse.json(
        { error: "ImageKit configuration is missing on the server" },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}
