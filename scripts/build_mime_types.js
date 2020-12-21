const {writeFileSync} = require("fs");

const {types} = require("mime-types");

const PATH_MODULE = "./src/data/mime_types.ts";

const TEMPLATE_MODULE = ({json}) => `export default ${json} as {[key: string]: string};`;

writeFileSync(
    PATH_MODULE,
    TEMPLATE_MODULE({
        json: JSON.stringify(types, null, 4),
    })
);
