// ts-ignore 7017 is used to ignore the error that the global object is not

import { Scougi, ScougiPage, User } from "@prisma/client";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from 'kysely-planetscale'

declare interface DB {
  User: User;
  Scougi: Scougi
  ScougiPage: ScougiPage
}

const globalForDB = global as unknown as { db: Kysely<DB> }

export const db = globalForDB.db || new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    host: process.env.PLANETSCALE_DB_HOST,
    username: process.env.PLANETSCALE_DB_USERNAME,
    password: process.env.PLANETSCALE_DB_PASSWORD,
  }),
})
if (process.env.NODE_ENV !== 'production') globalForDB.db = db

export default db
