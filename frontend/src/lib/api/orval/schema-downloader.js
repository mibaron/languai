import axios from "axios";
import { writeFileSync } from "fs";

const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.includes("=")) {
    const firstEqualIndex = arg.indexOf("=");
    const key = arg.substring(0, firstEqualIndex);
    const value = arg.substring(firstEqualIndex + 1);
    acc[key] = value;
  }
  return acc;
}, {});

const url = args.url;
const output = args.output;
const username = args.username;
const password = args.password;

if (!url || !output) {
  console.error("Usage: node schema-downloader.js url=<url> output=<file> [username=<user> password=<pass>]");
  process.exit(1);
}

const headers = {};
if (username && password) {
  headers["Authorization"] = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

axios
  .get(url, { headers })
  .then((response) => {
    writeFileSync(output, JSON.stringify(response.data, null, 2));
    console.log(`Schema written to ${output}`);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
