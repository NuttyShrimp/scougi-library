import { parse, stringify, uneval } from 'devalue';

export const transformer = {
  input: {
    serialize: (object: unknown) => stringify(object),
    deserialize: (object: string) => parse(object)
  },
  output: {
    serialize: (object: unknown) => uneval(object),
    deserialize: (object: string) => eval(`(${object})`)
  }
};
