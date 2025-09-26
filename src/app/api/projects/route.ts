import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Helper to safely build public URLs from file paths
const toPublicUrl = (absPath: string) => {
  const publicDir = path.join(process.cwd(), "public");
  const rel = absPath.replace(publicDir, "").split(path.sep).map(encodeURIComponent).join("/");
  return rel.startsWith("/") ? rel : `/${rel}`;
};

async function readFolderFiles(absDir: string) {
  try {
    const items = await fs.readdir(absDir, { withFileTypes: true });
    const files = await Promise.all(
      items
        .filter((d) => d.isFile())
        .map(async (d) => {
          const p = path.join(absDir, d.name);
          return { name: d.name, url: toPublicUrl(p) };
        })
    );
    return files;
  } catch {
    return [];
  }
}

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");
  const aboutMeDir = path.join(publicDir, "about-me");
  const projectsRoot = path.join(publicDir, "projects");

  // Ensure base folders exist (non-throwing)
  await fs.mkdir(aboutMeDir, { recursive: true }).catch(() => {});
  await fs.mkdir(projectsRoot, { recursive: true }).catch(() => {});

  // Scan projects (directories only)
  let projects: { name: string; files: { name: string; url: string }[] }[] = [];
  try {
    const entries = await fs.readdir(projectsRoot, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory());
    projects = await Promise.all(
      dirs.map(async (dir) => {
        const projectDir = path.join(projectsRoot, dir.name);
        const files = await readFolderFiles(projectDir);
        return { name: dir.name, files };
      })
    );
  } catch {
    projects = [];
  }

  // Hide empty project folders
  projects = projects.filter((p) => p.files.length > 0);

  const aboutMeFiles = await readFolderFiles(aboutMeDir);

  return NextResponse.json({
    aboutMe: { name: "About Me", files: aboutMeFiles },
    projects,
  });
}