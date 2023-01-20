# CAMELO

Because we can't anymore :(

---

## Description

Script to run ocaml test suites on Caml code even if it does not compile.

## Usage

requires [deno](https://deno.land).

```sh
deno run -A --unstable "./run.ts" <input_files> <tests_folder>
```

example :

```sh
deno run -A --unstable "./run.ts" "./example/source.ml" "./example/tests"
```

## Author

- JOLIMAITRE Matthieu <matthieu@imagevo.fr>
