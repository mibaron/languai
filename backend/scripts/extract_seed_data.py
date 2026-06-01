#!/usr/bin/env python3
"""Extract seed data from german-cheatsheet.jsx into seed_data.json.

Parses the BOOKS constant from the JSX file and outputs a clean JSON
file that the seed_content management command can import.

Usage:
    python scripts/extract_seed_data.py
"""

import json
import re
from pathlib import Path

JSX_PATH = Path(__file__).resolve().parent.parent.parent / "german-cheatsheet.jsx"
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "seed_data.json"


def extract_books_json(jsx_content: str) -> str:
    """Extract the BOOKS object from JSX and convert to valid JSON."""
    match = re.search(r"const BOOKS = (\{.*?\n\};)", jsx_content, re.DOTALL)
    if not match:
        raise ValueError("Could not find BOOKS constant in JSX file")

    raw = match.group(1).rstrip(";")

    # Convert JS object syntax to JSON:
    # - Add quotes around unquoted keys
    # - Remove trailing commas
    result = re.sub(r'(?<=[{,\n])\s*(\w+)\s*:', r' "\1":', raw)
    result = re.sub(r",\s*([}\]])", r"\1", result)

    return result


def main() -> None:
    if not JSX_PATH.exists():
        print(f"Error: JSX file not found at {JSX_PATH}")
        return

    jsx_content = JSX_PATH.read_text()
    try:
        books_json = extract_books_json(jsx_content)
        books = json.loads(books_json)
    except (json.JSONDecodeError, ValueError):
        print("Regex-based extraction failed, using manual parse approach...")
        books = manual_parse(jsx_content)

    OUTPUT_PATH.write_text(json.dumps(books, indent=2, ensure_ascii=False))
    print(f"Seed data written to {OUTPUT_PATH}")

    total_sections = sum(
        len(sections)
        for categories in books.values()
        for sections in categories.values()
    )
    print(f"  Levels: {len(books)}")
    print(f"  Total sections: {total_sections}")


def manual_parse(jsx_content: str) -> dict:
    """Fallback: build seed data directly from the known JSX structure."""
    import subprocess
    import sys

    node_script = """
    const fs = require('fs');
    const content = fs.readFileSync(process.argv[1], 'utf-8');
    const match = content.match(/const BOOKS = (\\{[\\s\\S]*?\\n\\};)/);
    if (!match) { process.exit(1); }
    const obj = eval('(' + match[1].slice(0, -1) + ')');
    console.log(JSON.stringify(obj));
    """

    try:
        result = subprocess.run(
            ["node", "-e", node_script, str(JSX_PATH)],
            capture_output=True,
            text=True,
            check=True,
        )
        return json.loads(result.stdout)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Node.js fallback also failed. Please install Node.js or fix the JSX file.")
        sys.exit(1)


if __name__ == "__main__":
    main()
