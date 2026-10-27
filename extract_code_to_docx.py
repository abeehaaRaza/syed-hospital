"""
extract_source.py
-----------------
Extracts ONLY the actual source-code files from a project into a single .docx.

Strictly ignores:
  - node_modules / venv / site-packages / packages
  - dist / build / out / .next / .nuxt / .turbo / coverage
  - lock files (package-lock.json, yarn.lock, pnpm-lock.yaml)
  - minified / bundled files (*.min.js, *.bundle.js, *.map)
  - hidden folders (.git, .github, .idea, .vscode, ...)
  - binaries, images, fonts, videos
"""

import os
import re
from pathlib import Path
from datetime import datetime

from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH


# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
PROJECT_ROOT = r"."                 # scan current folder
OUTPUT_FILE  = "Source_Codebase.docx"

# ── Only these extensions are considered "source code" ────────────────────
SOURCE_EXTENSIONS = {
    # JS / TS family
    ".js", ".jsx", ".mjs", ".cjs",
    ".ts", ".tsx", ".mts", ".cts",
    # web
    ".html", ".htm", ".css", ".scss", ".sass", ".less",
    ".vue", ".svelte", ".astro",
    # other languages (kept in case they're present)
    ".py", ".java", ".kt", ".swift", ".go", ".rs",
    ".c", ".cpp", ".h", ".hpp", ".cs", ".rb", ".php",
    ".dart", ".r", ".lua", ".sql", ".graphql", ".gql",
}

# ── Config / data files that ARE part of the codebase ─────────────────────
SOURCE_FILENAMES = {
    "package.json",
    "tsconfig.json",
    "jsconfig.json",
    "vite.config.ts", "vite.config.js",
    "next.config.js", "next.config.ts", "next.config.mjs",
    "tailwind.config.js", "tailwind.config.ts",
    "postcss.config.js", "postcss.config.cjs",
    "eslint.config.js", ".eslintrc", ".eslintrc.json", ".eslintrc.js",
    ".prettierrc", ".prettierrc.json", ".prettierrc.js",
    "docker-compose.yml", "docker-compose.yaml",
    "Dockerfile",
    "README.md", "README.txt",
    ".env.example",
}

# ── Folders we NEVER enter (packages, build output, caches) ───────────────
EXCLUDE_DIRS = {
    # dependency / package folders
    "node_modules", "bower_components", "jspm_packages",
    "venv", ".venv", "env", ".env", "virtualenv",
    "site-packages", "packages", "vendor",
    # build output
    "dist", "build", "out", "output", ".next", ".nuxt", ".svelte-kit",
    ".turbo", ".parcel-cache", ".cache", ".output", "public/build",
    # tooling / IDE / VCS
    ".git", ".github", ".gitlab", ".idea", ".vscode", ".vs",
    ".pytest_cache", ".mypy_cache", ".ruff_cache", ".tox",
    "__pycache__", "coverage", ".nyc_output", "htmlcov",
    # misc
    "logs", "tmp", "temp", ".DS_Store",
}

# ── Filename patterns we skip even if the extension matches ───────────────
EXCLUDE_FILE_PATTERNS = [
    re.compile(p, re.IGNORECASE) for p in [
        r".*\.min\.(js|css)$",          # minified
        r".*\.bundle\.(js|css)$",       # bundled
        r".*\.chunk\.(js|css)$",        # chunked
        r".*\.map$",                    # source maps
        r".*\.lock$",                   # lock files
        r"package-lock\.json$",
        r"yarn\.lock$",
        r"pnpm-lock\.yaml$",
        r"bun\.lockb$",
        r".*\.(png|jpe?g|gif|svg|ico|webp|bmp|tiff)$",
        r".*\.(woff2?|ttf|otf|eot)$",
        r".*\.(mp[34]|webm|avi|mov|mkv)$",
        r".*\.(pdf|zip|tar|gz|rar|7z)$",
        r".*\.(exe|dll|so|dylib|bin)$",
    ]
]

# ── Files larger than this are skipped (safety net) ───────────────────────
MAX_FILE_SIZE = 800_000   # 800 KB
# ---------------------------------------------------------------------------


def is_source_file(path: Path) -> bool:
    """True only if the file is real source code (not noise)."""
    name = path.name

    # reject by pattern (minified, maps, lock files, binaries…)
    for pat in EXCLUDE_FILE_PATTERNS:
        if pat.match(name):
            return False

    # accept known config filenames
    if name in SOURCE_FILENAMES:
        return True

    # accept by extension
    return path.suffix.lower() in SOURCE_EXTENSIONS


def collect_source_files(root: Path):
    """Return sorted [(full_path, relative_path)] of real source files."""
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excluded directories in-place (fast + effective)
        dirnames[:] = [
            d for d in dirnames
            if d not in EXCLUDE_DIRS and not d.startswith(".")
        ]

        for fname in filenames:
            full = Path(dirpath) / fname
            if not is_source_file(full):
                continue
            try:
                if full.stat().st_size > MAX_FILE_SIZE:
                    print(f"  [skip: >{MAX_FILE_SIZE//1000}KB] {full}")
                    continue
            except OSError:
                continue

            rel = full.relative_to(root)
            files.append((full, rel))

    files.sort(key=lambda x: str(x[1]).lower())
    return files


# ---------------------------------------------------------------------------
# DOCX BUILDING
# ---------------------------------------------------------------------------
def add_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.color.rgb = RGBColor(0x1F, 0x3B, 0x73)
    return h


def add_code_block(doc, code_text: str, rel_path: Path):
    # Label (path)
    label = doc.add_paragraph()
    run = label.add_run(f"📄 {rel_path}")
    run.bold = True
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

    # Code
    para = doc.add_paragraph()
    para.paragraph_format.left_indent = Inches(0.2)
    para.paragraph_format.space_after = Pt(6)
    run = para.add_run(code_text)
    run.font.name = "Consolas"
    run.font.size = Pt(8.5)

    # force Consolas for east-asian + fallback
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.makeelement(
        "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rFonts", {}
    )
    for attr in ("ascii", "hAnsi", "cs"):
        rFonts.set(
            f"{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}{attr}",
            "Consolas",
        )
    rPr.append(rFonts)

    doc.add_paragraph()   # spacer


def build_docx(root: Path, output: str):
    print(f"📂 Scanning: {root}\n")
    files = collect_source_files(root)

    if not files:
        print("⚠️  No source files found. Check PROJECT_ROOT / extensions.")
        return

    doc = Document()

    # ── Cover ─────────────────────────────────────────────────────────────
    title = doc.add_heading("Project Source Code", level=0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = sub.add_run(
        f"Project : {root.resolve().name}\n"
        f"Files   : {len(files)}\n"
        f"Created : {datetime.now():%Y-%m-%d %H:%M:%S}"
    )
    run.italic = True
    run.font.size = Pt(11)
    doc.add_page_break()

    # ── ToC ───────────────────────────────────────────────────────────────
    add_heading(doc, "Table of Contents", level=1)
    for _, rel in files:
        p = doc.add_paragraph(str(rel), style="List Bullet")
        p.runs[0].font.size = Pt(10)
    doc.add_page_break()

    # ── Code sections ─────────────────────────────────────────────────────
    add_heading(doc, "Source Code", level=1)
    for full, rel in files:
        add_heading(doc, str(rel), level=2)
        try:
            text = full.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            text = f"[Could not read: {e}]"
        add_code_block(doc, text, rel)

    doc.save(output)
    print(f"\n✅ Wrote {len(files)} source files → {output}")


if __name__ == "__main__":
    build_docx(Path(PROJECT_ROOT).resolve(), OUTPUT_FILE)