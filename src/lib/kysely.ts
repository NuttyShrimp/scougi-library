import { ColumnType, Generated, Kysely } from "kysely";
import {PlanetScaleDialect} from 'kysely-planetscale'
// import {fetch} from 'undici'

declare type Timestamp = ColumnType<Date, Date | string, Date | string>;

declare interface ScougiTable {
  id: Generated<number>;
  year: string;
  trim: number;
  pages: number;
  preview: string;
  hidden: boolean;
  updatedAt: Timestamp;
}

declare interface ScougiPageTable {
  number: number;
  id: number;
  data: Buffer;
}

declare interface ScougiPdfPageTable {
  number: number;
  id: number;
  data: Buffer;
}

declare interface DB {
  Scougi: ScougiTable;
  ScougiPage: ScougiPageTable
  ScougiPdfPage: ScougiPdfPageTable
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars,no-var
  var db: Kysely<DB> | undefined;
}
export let db: Kysely<DB>;

if (process.env.NODE_ENV === "production") {
  db = new Kysely<DB>({
    dialect: new PlanetScaleDialect({
      url: process.env.DATABASE_URL,
      // fetch,
    }),
  })
} else {
  if (!global.db) {
    global.db = new Kysely<DB>({
      dialect: new PlanetScaleDialect({
        url: process.env.DATABASE_URL,
        // fetch,
      }),
    })
  }
  db = global.db;
}

export default db;
