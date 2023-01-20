import { decode, show_diff } from "./utils.ts";

export type RunRes = {
  success: true;
  output: string;
} | {
  success: false;
  error: string;
};

export async function run_script(script: string): Promise<RunRes> {
  const tmp_path = "/tmp/script.ml";
  await Deno.writeTextFile(tmp_path, script);
  const process = Deno.run({
    cmd: ["ocaml", tmp_path],
    stdout: "piped",
    stderr: "piped",
  });
  const { success } = await process.status();
  await Deno.remove(tmp_path);

  if (success) {
    return { success, output: decode(await process.output()) };
  } else {
    return { success, error: decode(await process.stderrOutput()) };
  }
}

function remove_comments(source: string): string {
  const [head, ...rest] = source.split("(*");
  const remainder = rest.map((w) => {
    const [_, code] = w.split("*)");
    return code;
  });
  return [head, ...remainder].join("");
}

export async function reduce_to_runable(source: string) {
  const clean_source = remove_comments(source);
  let current = "";
  for (const part of clean_source.split(";;")) {
    let concatenated;
    if (current == "") concatenated = part;
    else concatenated = `${current};;${part}`;
    const res = await run_script(concatenated);
    if (res.success) current = concatenated;
  }
  await show_diff(clean_source, current);
  return current;
}
