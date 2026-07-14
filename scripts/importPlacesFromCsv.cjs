const fs = require("fs");
const path = require("path");

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/importPlacesFromCsv.cjs <csvPath>");
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function hashText(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 33) ^ text.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

function makeId(place, index) {
  const key = [place.city, place.region, place.type, place.category, place.name].join("|");
  return place.type + "-" + (index + 1) + "-" + hashText(key);
}

function makeNaverSearchUrl(title) {
  return "https://map.naver.com/p/search/" + encodeURIComponent(title);
}

const text = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
const rows = parseCsv(text).filter((row) => row.some((cell) => String(cell).trim()));
const header = rows[0] || [];
const indexes = new Map();
header.forEach((name, index) => {
  if (name) indexes.set(String(name).trim(), index);
});

for (const name of ["city", "region", "type", "category", "title", "customTag", "url"]) {
  if (!indexes.has(name)) throw new Error("CSV column missing: " + name);
}

const places = rows.slice(1).flatMap((row, index) => {
  const get = (name) => String(row[indexes.get(name)] || "").trim();
  const type = get("type");
  const name = get("title");
  if (!name || !["food", "activity", "cafe"].includes(type)) return [];
  const place = {
    id: "",
    city: get("city"),
    region: get("region"),
    type,
    category: get("category"),
    name,
    customTag: get("customTag") || undefined,
    tags: [get("category"), get("customTag")].filter(Boolean),
    mapUrl: get("url") || makeNaverSearchUrl(name),
  };
  place.id = makeId(place, index);
  return [place];
});

const content = [
  'import type { Place } from "@/types/place";',
  "",
  "// CSV source columns: city, region, type, category, title, customTag, url",
  "export const places: Place[] = ",
  JSON.stringify(places, null, 2),
  ";",
].join("\n");

fs.writeFileSync(path.join(process.cwd(), "src", "data", "places.ts"), content + "\n", "utf8");
console.log("Imported " + places.length + " places from " + csvPath);
