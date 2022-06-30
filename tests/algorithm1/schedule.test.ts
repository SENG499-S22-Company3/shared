import jestOpenAPI from "jest-openapi";
import path from "path";

const specPath = "./algorithm1/algorithm-1-2.0-resolved.json";

// Load an OpenAPI file (YAML or JSON) into this plugin
jestOpenAPI(path.join(__dirname, specPath));
