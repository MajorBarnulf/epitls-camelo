import col from "https://deno.land/x/chalkin@v0.1.3/mod.ts";
import { Cli } from "https://deno.land/x/clir@v1.1.0/mod.ts";
import { reduce_to_runable } from "./lib/source.ts";
import {
  display_test_failures,
  display_test_success,
  find_tests,
  run_test,
  TestRes,
} from "./lib/test.ts";

const cli = new Cli({
  name: "camelo",
  description: "tool to write and run caml test suites fast",
  parameters: {
    "input": {
      description:
        'input files to use before testsuites separated by comas\nex: "file1.ml,file2.ml"',
    },
    "tests": {
      description: "directory containing tests as ocaml files",
    },
  },
});

const input_files = cli.parameter_value("input")!.split(",");
const raw_sources = await Promise.all(
  input_files.map((f) => Deno.readTextFile(f)),
);
console.log(col.blue("---- diff to runnable sections ----"));
const sources = [] as string[];
for (const s of raw_sources) sources.push(await reduce_to_runable(s));
const prelude = sources.join("\n");

const tests_dir = cli.parameter_value("tests")!;
const tests = await find_tests(tests_dir);

console.log(col.blue("---- running tests ----"));
const results = [] as TestRes[];
for (const test of tests) {
  const res = await run_test(test, prelude);
  display_test_success(res);
  results.push(res);
}
display_test_failures(results);
