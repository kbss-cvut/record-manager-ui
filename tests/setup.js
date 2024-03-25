import { test } from "vitest";

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: "./.env.test",
  sample: "./.env.example",
});
global.xit = test.skip;
