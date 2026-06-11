const fs = require("fs");
const path = require("path");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      return;
    }

    const [, key, rawValue] = match;

    if (process.env[key] !== undefined) {
      return;
    }

    let value = rawValue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

const command = process.argv[2];
const clientRoot = path.resolve(__dirname, "..");

if (!command) {
  console.error("Missing react-scripts command.");
  process.exit(1);
}

const envFiles =
  command === "build"
    ? [".env", ".env.local", ".env.production", ".env.production.local"]
    : [".env", ".env.local", ".env.development", ".env.development.local"];

envFiles.forEach((fileName) => {
  parseEnvFile(path.join(clientRoot, fileName));
});

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY && process.env.VITE_CLERK_PUBLISHABLE_KEY) {
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}

require(`react-scripts/scripts/${command}`);
