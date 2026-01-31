import "dotenv/config";
import { kbSearch } from "@einari/kb";

async function main() {
  const results = await kbSearch("how is the repo structured?", 5);
  console.dir(results, { depth: null });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
