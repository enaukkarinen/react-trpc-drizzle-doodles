import path from "node:path";
import { fileURLToPath } from "node:url";

export const LAD_GEOJSON_URL = "https://files.planning.data.gov.uk/dataset/local-authority-district.geojson";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const LAD_GEOJSON_PATH = path.resolve(__dirname, "../../../../static/local-authority-district.geojson");
