const fs = require("fs");
const path = require("path");

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/importPlacesFromCsv.cjs <csvPath>");
  process.exit(1);
}

const citySlugMap = {
  "\uC11C\uC6B8": "seoul",
  "\uC778\uCC9C": "incheon",
};
const regionSlugMap = {
  "\uD64D\uB300/\uC5F0\uB0A8": "hongdae-yeonnam",
  "\uC131\uC218": "seongsu",
  "\uAC15\uB0A8": "gangnam",
  "\uC555\uAD6C\uC815": "apgujeong",
  "\uC7A0\uC2E4": "jamsil",
  "\uC774\uD0DC\uC6D0": "itaewon",
  "\uC774\uD0DC\uC6D0/\uD55C\uB0A8": "itaewon",
  "\uC885\uB85C/\uC775\uC120\uB3D9": "jongno-ikseon",
  "\uC5EC\uC758\uB3C4": "yeouido",
  "\uAD00\uC545\uAD6C": "gwanak",
  "\uC1A1\uB3C4": "songdo",
  "\uAD6C\uC6D4": "guwol",
  "\uAD6C\uC6D4\uB3D9": "guwol",
  "\uBD80\uD3C9": "bupyeong",
  "\uCC28\uC774\uB098\uD0C0\uC6B4/\uC6D4\uBBF8\uB3C4": "chinatown-wolmido",
  "\uCC28\uC774\uB098/\uC6D4\uBBF8\uB3C4/\uC6A9\uD604\uB3D9": "chinatown-wolmido",
};
const categorySlugMap = {
  "\uD55C\uC2DD": "korean",
  "\uC591\uC2DD": "western",
  "\uC77C\uC2DD": "japanese",
  "\uC911\uC2DD": "chinese",
  "\uBD84\uC2DD": "bunsik",
  "\uC220\uC9D1": "bar",
  "\uACE0\uAE30": "meat",
  "\uC0D0\uB7EC\uB4DC": "salad",
  "\uC0B0\uCC45": "walk",
  "\uC1FC\uD551": "shopping",
  "\uC57C\uACBD": "night",
  "\uB4DC\uB77C\uC774\uBE0C": "drive",
  "\uC0AC\uC9C4": "photo",
  "\uC804\uC2DC/\uBB38\uD654": "exhibition",
  "\uCCB4\uD5D8/\uACF5\uBC29": "workshop",
  "\uC561\uD2F0\uBE44\uD2F0": "activity",
  "\uCE74\uD398": "cafe",
  "": "cafe",
};

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

function fallbackSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\s_/\\]+/g, "-")
    .replace(/[^0-9a-z-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "unknown";
}

function citySlug(city) {
  return citySlugMap[city] || fallbackSlug(city);
}

function regionSlug(region) {
  return regionSlugMap[region] || fallbackSlug(region);
}

function categorySlug(place) {
  if (place.type === "cafe") return "cafe";
  return categorySlugMap[place.category] || fallbackSlug(place.category);
}

function assignMappedIds(places) {
  const counts = new Map();
  for (const place of places) {
    const base = [place.type, citySlug(place.city), regionSlug(place.region), categorySlug(place)].join("-");
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    place.id = base + "-" + String(count).padStart(3, "0");
  }
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

const places = rows.slice(1).flatMap((row) => {
  const get = (name) => String(row[indexes.get(name)] || "").trim();
  const type = get("type");
  const name = get("title");
  if (!name || !["food", "activity", "cafe"].includes(type)) return [];
  return [{
    id: "",
    city: get("city"),
    region: get("region"),
    type,
    category: get("category"),
    name,
    customTag: get("customTag") || undefined,
    tags: [get("category"), get("customTag")].filter(Boolean),
    mapUrl: get("url") || makeNaverSearchUrl(name),
  }];
});

const manualPlaces = [
  {
    id: "",
    city: "\uC11C\uC6B8",
    region: "\uAC15\uB0A8",
    type: "food",
    category: "\uC220\uC9D1",
    name: "\uC2DC\uC988\uB110\uD1A4",
    customTag: "\uC591\uACE0\uAE30\uB9DB\uC9D1",
    tags: ["\uC220\uC9D1", "\uB370\uC774\uD2B8\uCE75\uD14C\uC77C"],
    mapUrl: makeNaverSearchUrl("\uC2DC\uC988\uB110\uD1A4"),
  },
];

for (const manualPlace of manualPlaces) {
  const existingIndex = places.findIndex(
    (place) =>
      place.type === manualPlace.type &&
      place.city === manualPlace.city &&
      place.region === manualPlace.region &&
      place.category === manualPlace.category &&
      place.name === manualPlace.name,
  );
  if (existingIndex >= 0) places[existingIndex] = { ...places[existingIndex], ...manualPlace };
  else places.push(manualPlace);
}

assignMappedIds(places);
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
