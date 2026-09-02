const fs = require("fs");

const SUPPORTED_NETWORKS = [
  "polkadot",
  "ethereum",
  "solana",
  "kusama",
  "sui",
  "near",
  "zcash",
];
const TEMPLATE = {
  baseUrl: "https://raw.githubusercontent.com",
  branch: "master",
  cdn: {
    jsDelivr: "https://cdn.jsdelivr.net/gh",
    statically: "https://cdn.statically.io/gh",
  },
  path: "v2",
  repository: "galacticcouncil/intergalactic-asset-metadata",
  items: [],
};

const getResource = (network, predicate) => {
  try {
    const files = fs.readdirSync(TEMPLATE.path + "/" + network, {
      recursive: true,
    });
    const assets = files.filter((path) => predicate(path));
    return assets
      .filter((path) => /.(jpg|png|svg)$/.test(path))
      .map((i) => network + "/" + i);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const writeResource = (name, predicate) => {
  const resources = SUPPORTED_NETWORKS.map((n) => getResource(n, predicate))
    .flat()
    .sort();

  const resourcesJson = JSON.stringify(
    { ...TEMPLATE, items: resources },
    null,
    2
  );
  fs.writeFileSync(name, resourcesJson);
};

writeResource("assets-v2.json", (path) => path.includes("/assets/"));
writeResource("chains-v2.json", (path) => !path.includes("/assets/"));
