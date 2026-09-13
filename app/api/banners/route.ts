import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

export async function GET() {
  try {
    const bannerDirectory = path.join(
      process.cwd(),
      "public",
      "images",
      "banner"
    );

    const files = await fs.readdir(bannerDirectory);

    const images = files
      .filter((file) => {
        const extension = path
          .extname(file)
          .toLowerCase();

        return ALLOWED_EXTENSIONS.includes(extension);
      })
      .sort((a, b) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      )
      .map((file) => ({
        id: file,
        image: `/images/banner/${file}`,
      }));

    return NextResponse.json(images);
  } catch (error) {
    console.error(
      "Unable to read banner folder:",
      error
    );

    return NextResponse.json([]);
  }
}