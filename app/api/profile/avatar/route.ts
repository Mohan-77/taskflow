import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_BYTES = 2 * 1024 * 1024;
const EXTENSIONS = ["jpg", "png", "webp", "gif"] as const;

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

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  const safeId = session.user.id.replace(/[^a-zA-Z0-9]/g, "");

  if (!safeId) {
    return NextResponse.json(
      { success: false, message: "Could not save the profile photo." },
      { status: 400 }
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

  const directory = path.join(process.cwd(), "public", "avatars");
  await mkdir(directory, { recursive: true });

  await Promise.all(
    EXTENSIONS.map((current) =>
      unlink(path.join(directory, `${safeId}.${current}`)).catch(() => undefined)
    )
  );

  await writeFile(path.join(directory, `${safeId}.${extension}`), bytes);

  return NextResponse.json({
    success: true,
    image: `/avatars/${safeId}.${extension}?v=${Date.now()}`,
  });
}
