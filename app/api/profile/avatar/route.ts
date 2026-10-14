import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import ProfilePhoto, {
  PROFILE_PHOTO_TYPES,
  type ProfilePhotoType,
} from "@/lib/models/ProfilePhoto";

const MAX_BYTES = 2 * 1024 * 1024;

const CONTENT_TYPES: Record<"png" | "jpg" | "gif" | "webp", ProfilePhotoType> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

function extensionFor(bytes: Buffer, mime: string) {
  const isPng =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;
  const isGif =
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38;
  const isWebp =
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP";

  if (mime === "image/png" && isPng) return "png";
  if ((mime === "image/jpeg" || mime === "image/jpg") && isJpeg) return "jpg";
  if (mime === "image/gif" && isGif) return "gif";
  if (mime === "image/webp" && isWebp) return "webp";
  return null;
}

function isProfilePhotoType(value: string): value is ProfilePhotoType {
  return PROFILE_PHOTO_TYPES.some((type) => type === value);
}

function errorName(error: unknown) {
  return error instanceof Error ? error.name : "Error";
}

function isDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
}

async function saveProfilePhoto(
  userId: string,
  contentType: ProfilePhotoType,
  data: Buffer
) {
  const update = { $set: { contentType, data } };

  try {
    await ProfilePhoto.findOneAndUpdate({ userId }, update, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
  } catch (error) {
    if (!isDuplicateKey(error)) {
      throw error;
    }

    await ProfilePhoto.updateOne({ userId }, update);
  }
}

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  try {
    await connectMongoose();

    const photo = await ProfilePhoto.findOne({ userId: user.id });

    if (!photo || !isProfilePhotoType(photo.contentType) || photo.data.length === 0) {
      return NextResponse.json(
        { success: false, message: "No profile photo is saved." },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(photo.data), {
      headers: {
        "Content-Type": photo.contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Load profile photo error:", errorName(error));

    return NextResponse.json(
      { success: false, message: "Could not load the profile photo." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: "Choose an image file." },
      { status: 400 }
    );
  }

  const file = form.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "Choose an image file." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { success: false, message: "Image must be 2 MB or smaller." },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = extensionFor(bytes, file.type);

  if (!extension) {
    return NextResponse.json(
      { success: false, message: "Use a JPG, PNG, WEBP, or GIF image." },
      { status: 400 }
    );
  }

  try {
    await connectMongoose();
    await saveProfilePhoto(user.id, CONTENT_TYPES[extension], bytes);
  } catch (error) {
    console.error("Save profile photo error:", errorName(error));

    return NextResponse.json(
      { success: false, message: "Could not save the profile photo." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    image: `/api/profile/avatar?v=${Date.now()}`,
  });
}
