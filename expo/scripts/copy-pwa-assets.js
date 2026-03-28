const fs = require("fs");
const path = require("path");

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.error("Missing:", src);
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("Copied:", src, "→", dest);
}

// Copy from your source folder into dist (Netlify publish dir)
copyFile("web/manifest.json", "dist/manifest.json");
copyFile("web/sw.js", "dist/sw.js");
copyFile("web/icons/icon-192.png", "dist/icons/icon-192.png");
copyFile("web/icons/icon-512.png", "dist/icons/icon-512.png");

// Optional: iOS icon at root
if (fs.existsSync("web/apple-touch-icon.png")) {
  copyFile("web/apple-touch-icon.png", "dist/apple-touch-icon.png");
}
