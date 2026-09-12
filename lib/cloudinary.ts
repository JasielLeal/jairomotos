import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function isDataUri(value: string) {
  return value.startsWith("data:image/");
}

export async function uploadImage(dataUri: string, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `jairomotos/${folder}`,
    resource_type: "image",
  });
  return result.secure_url;
}

// Cloudinary URLs look like .../upload/v1690000000/jairomotos/products/abc123.webp —
// the public_id is everything between the (optional) version segment and the extension.
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? match[1] : null;
}

export async function deleteImage(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("cloudinary:destroy", error);
  }
}

// Uploads any newly-picked photo (still a "data:image/..." URI) and keeps
// already-hosted ones ("https://...") untouched, then deletes from Cloudinary
// whatever was in `previous` but didn't make it into the new list — so editing
// a product/motorcycle's photos never leaves orphaned assets behind.
export async function syncImages({
  previous,
  incoming,
  folder,
}: {
  previous: string[];
  incoming: string[];
  folder: string;
}): Promise<string[]> {
  const next = await Promise.all(
    incoming.map((image) => (isDataUri(image) ? uploadImage(image, folder) : image))
  );

  const removed = previous.filter((url) => !next.includes(url));
  await Promise.all(removed.map((url) => deleteImage(url)));

  return next;
}
