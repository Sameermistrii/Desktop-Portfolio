import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const shortcutsDir = path.join(publicDir, "shortcuts");

    let entries: Array<{ label: string; url: string; embedded: boolean; icon?: string }> = [];

    // helper to scan a directory and build entries with correct public URLs
    const scanDir = async (dir: string) => {
      try {
        const files = await fs.readdir(dir, { withFileTypes: true });
        const supported = files.filter((f) => {
          if (!f.isFile()) return false;
          const name = f.name.toLowerCase();
          return name.endsWith(".json") || name.endsWith(".xyd") || name.endsWith(".txt");
        });

        const relativeBase = path.relative(publicDir, dir).split(path.sep).join("/"); // e.g., "shortcuts"

        const results = await Promise.all(
          supported.map(async (f) => {
            const filePath = path.join(dir, f.name);
            const ext = path.extname(f.name).toLowerCase();
            const label = path.parse(f.name).name;

            try {
              if (ext === ".txt") {
                const url = `/${relativeBase}/${encodeURIComponent(f.name)}`;
                let icon: string | undefined;
                const pngPath = path.join(dir, `${label}.png`);
                const jpgPath = path.join(dir, `${label}.jpg`);
                const jpegPath = path.join(dir, `${label}.jpeg`);
                try {
                  await fs.access(pngPath);
                  icon = `/${relativeBase}/${encodeURIComponent(label)}.png`;
                } catch {
                  try {
                    await fs.access(jpgPath);
                    icon = `/${relativeBase}/${encodeURIComponent(label)}.jpg`;
                  } catch {
                    try {
                      await fs.access(jpegPath);
                      icon = `/${relativeBase}/${encodeURIComponent(label)}.jpeg`;
                    } catch {}
                  }
                }
                return { label, url, embedded: true, icon };
              }

              const raw = await fs.readFile(filePath, "utf-8");
              const data = JSON.parse(raw) as { url?: string };
              const url = (data.url || "").trim();
              const embedded = ext === ".xyd";
              if (url) {
                return { label, url, embedded };
              }
            } catch {}
            return null;
          })
        );

        return results.filter((x): x is { label: string; url: string; embedded: boolean; icon?: string } => Boolean(x));
      } catch {
        return [] as Array<{ label: string; url: string; embedded: boolean; icon?: string }>;
      }
    };

    // Revert: only scan the /public/shortcuts directory
    const fromShortcuts = await scanDir(shortcutsDir);
    entries = fromShortcuts;

    return NextResponse.json({ shortcuts: entries });
  } catch (error) {
    return NextResponse.json({ shortcuts: [], error: "Failed to load shortcuts" }, { status: 500 });
  }
}