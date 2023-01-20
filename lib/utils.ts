export function decode(input: Uint8Array): string {
  return new TextDecoder().decode(input);
}

export async function show_diff(a: string, b: string) {
  const [path_a, path_b] = ["/tmp/diff_a", "/tmp/diff_b"];
  await Deno.writeTextFile(path_a, a);
  await Deno.writeTextFile(path_b, b);
  await Deno.run({ cmd: ["diff", path_a, path_b] }).status();
  await Deno.remove(path_a);
  await Deno.remove(path_b);
}
