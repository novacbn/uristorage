const {writeFileSync} = require("fs");

const {types} = require("mime-types");

const PATH_JSON = "./src/data/mime_types.json";

writeFileSync(PATH_JSON, JSON.stringify(types, null, 4));
