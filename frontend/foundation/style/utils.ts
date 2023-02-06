import { assignInlineVars } from "@vanilla-extract/dynamic";

/**
 * This function is for constructing variants with tokens. It is heavily typed with
 * generics because variants need to be correctly typed at build time for autocomplete
 * and typechecking.
 */
export const mapTokenScale = <Scale extends object, Token extends keyof Scale, Output>(
  tokenSet: Scale,
  map: (arg0: Token) => Output,
): Record<Token, Output> => {
  const keys = Object.keys(tokenSet) as Token[];
  return keys.reduce(
    (acc, token) => ({ ...acc, [token]: map(token) }),
    {} as Record<Token, Output>,
  );
};

// A more conveniently typed function to use in place of assignInlineVars.
export const setSXVars = (
  input: Record<string, string | undefined | false>,
): Record<string, string> => {
  const output: Record<string, string> = {};
  Object.entries(input).forEach(([k, v]) => {
    if (v != null && v !== false) {
      output[k] = v;
    }
  });
  return assignInlineVars(output);
};
