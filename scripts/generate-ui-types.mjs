import fs from "fs";
import path from "path";

const dir = "src/components/ui";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsx"));

for (const file of files.sort()) {
  const mod = file.replace(".jsx", "");
  const content = fs.readFileSync(path.join(dir, file), "utf8");
  const names = new Set();

  for (const m of content.matchAll(/export\s+(?:function|const)\s+(\w+)/g)) {
    names.add(m[1]);
  }
  for (const m of content.matchAll(/export\s*\{([^}]+)\}/gs)) {
    m[1].split(",").forEach((part) => {
      const n = part.trim().split(/\s+as\s+/)[0].trim();
      if (n) names.add(n);
    });
  }

  if (!names.size) continue;

  let out = `import type { ComponentType } from "react";\n\ntype UIComponent = ComponentType<any>;\n\n`;
  for (const n of [...names].sort()) {
    if (n.endsWith("Variants")) {
      out += `export function ${n}(...args: any[]): string;\n`;
    } else if (n === "reducer" || n === "toast" || n === "useToast") {
      out += `export const ${n}: any;\n`;
    } else if (n === "Toaster" && mod === "toaster") {
      out += `export function ${n}(props?: any): any;\n`;
    } else {
      out += `export const ${n}: UIComponent;\n`;
    }
  }

  fs.writeFileSync(path.join(dir, `${mod}.d.ts`), out);
}

console.log(`Wrote ${files.length} UI .d.ts files next to components`);
