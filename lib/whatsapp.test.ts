import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "@/lib/whatsapp";

describe("buildWhatsAppLink", () => {
  it("returns null when phone is missing", () => {
    expect(buildWhatsAppLink(null, "oi")).toBeNull();
    expect(buildWhatsAppLink(undefined, "oi")).toBeNull();
    expect(buildWhatsAppLink("", "oi")).toBeNull();
  });

  it("returns null when phone has too few digits", () => {
    expect(buildWhatsAppLink("1234", "oi")).toBeNull();
  });

  it("adds the 55 country code when missing", () => {
    const link = buildWhatsAppLink("11987654321", "oi");
    expect(link).toBe("https://wa.me/5511987654321?text=oi");
  });

  it("keeps the 55 country code when already present", () => {
    const link = buildWhatsAppLink("5511987654321", "oi");
    expect(link).toBe("https://wa.me/5511987654321?text=oi");
  });

  it("url-encodes the message", () => {
    const link = buildWhatsAppLink("11987654321", "Olá! Tudo bem?");
    expect(link).toBe(`https://wa.me/5511987654321?text=${encodeURIComponent("Olá! Tudo bem?")}`);
  });
});
