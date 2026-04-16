import fs from "fs";
const p = new URL("../src/pages/user/ApiDocs.jsx", import.meta.url);
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
let block = lines.slice(194, 1062).join("\n");
block = block.replace(/^\s*const apiSections = /, "return ");
const out =
	`import { BASE_URL } from "../../components/api-docs/ApiDocComponents.jsx";\n` +
	`import {\n` +
	`\tShield,\n\tUser,\n\tKey,\n\tShoppingCart,\n\tMail,\n\tGlobe,\n\tPackage,\n\tDollarSign,\n\tServer,\n` +
	`} from "lucide-react";\n\n` +
	`export function buildUserApiSections(user) {\n\t${block}\n}\n`;
const outPath = new URL(
	"../src/pages/user/apiDocsUserSections.js",
	import.meta.url,
);
fs.writeFileSync(outPath, out);
console.log("written", outPath.pathname);
