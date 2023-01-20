import col from "https://deno.land/x/chalkin@v0.1.3/mod.ts";
import { run_script } from "./source.ts";

export type Test = { name: string; content: string };

export async function find_tests(dir: string): Promise<Test[]> {
  const result = [] as Test[];
  for await (const { name } of Deno.readDir(dir)) {
    const content = await Deno.readTextFile(`${dir}/${name}`);
    result.push({ content, name });
  }
  result.sort((a, b) => a.name > b.name ? 1 : -1);
  return result;
}

export type TestRes = {
  test: Test;
  success: true;
} | {
  test: Test;
  success: false;
  error: string;
};

export async function run_test(
  test: Test,
  prelude: string,
): Promise<TestRes> {
  const source = `${prelude}\n${test.content}`;
  const res = await run_script(source);
  const { success } = res;
  if (success) return { success, test };
  const { error } = res;
  return { success, error, test };
}

export function display_test_success({ success, test: { name } }: TestRes) {
  console.log(`[${success ? col.green("O") : col.red("X")}] ${name}`);
}

export function display_test_failures(results: TestRes[]) {
  for (const result of results) {
    const { test: { name }, success } = result;
    if (success) continue;
    console.log(`${col.red(`---- error for '${name}' ----`)}
${result.error}
`);
  }
}
