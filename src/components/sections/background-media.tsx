import Image from "next/image";
import fs from "fs";
import path from "path";

// Server Component: reads /public/Desktop for a single media file (image or video)
export default function BackgroundMedia() {
  const desktopDir = path.join(process.cwd(), "public", "Desktop");
  let fileName: string | null = null;

  try {
    const entries = fs
      .readdirSync(desktopDir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((n) => !n.startsWith("."));
    fileName = entries[0] || null; // use first file if exists
  } catch {
    // directory may not exist in some environments
    fileName = null;
  }

  if (!fileName) return null;

  const ext = path.extname(fileName).toLowerCase().replace(".", "");
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg"].includes(ext);
  const src = `/Desktop/${fileName}`;

  return (
    <div className="absolute inset-0 z-0">
      {isImage && (
        <Image
          src={src}
          alt="Desktop background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {isVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
}