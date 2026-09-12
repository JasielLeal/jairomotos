import { describe, expect, it } from "vitest";
import { imagesArraySchema, MAX_IMAGES } from "@/lib/validations/image";

describe("imagesArraySchema", () => {
  it("accepts a data: URI (a newly picked, not-yet-uploaded photo)", () => {
    const result = imagesArraySchema().safeParse(["data:image/webp;base64,abc123"]);
    expect(result.success).toBe(true);
  });

  it("accepts an https:// URL (an already-uploaded Cloudinary photo)", () => {
    const result = imagesArraySchema().safeParse([
      "https://res.cloudinary.com/demo/image/upload/v1/jairomotos/products/abc.webp",
    ]);
    expect(result.success).toBe(true);
  });

  it("accepts a mix of new and already-uploaded photos", () => {
    const result = imagesArraySchema().safeParse([
      "https://res.cloudinary.com/demo/image/upload/v1/jairomotos/products/abc.webp",
      "data:image/webp;base64,abc123",
    ]);
    expect(result.success).toBe(true);
  });

  it("rejects a value that is neither a data: URI nor an https:// URL", () => {
    const result = imagesArraySchema().safeParse(["not-an-image"]);
    expect(result.success).toBe(false);
  });

  it("rejects more than MAX_IMAGES photos", () => {
    const result = imagesArraySchema().safeParse(
      Array.from({ length: MAX_IMAGES + 1 }, (_, i) => `data:image/webp;base64,${i}`)
    );
    expect(result.success).toBe(false);
  });

  it("defaults to allowing zero photos when no minimum is given", () => {
    const result = imagesArraySchema().safeParse([]);
    expect(result.success).toBe(true);
  });

  it("requires at least `min` photos when given", () => {
    const result = imagesArraySchema(1).safeParse([]);
    expect(result.success).toBe(false);
  });
});
