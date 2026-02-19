import * as assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { boolean, number, string } from '@remix-run/data-schema'
import {
  between,
  createDatabase,
  createTable,
  eq,
  gt,
  gte,
  ilike,
  inList,
  like,
  lt,
  lte,
  ne,
  notInList,
  isNull,
  notNull,
  type AdapterStatement,
  type DatabaseAdapter,
  or,
  and,
} from '@remix-run/data-table'
import { compilePostgresStatement } from './sql-compiler.ts'

let accounts = createTable({
  name: 'accounts',
  columns: {
    id: number(),
    email: string(),
    status: string(),
    deleted: boolean(),
  },
})

let tasks = createTable({
  name: 'tasks',
  columns: {
    id: number(),
    name: string(),
    account_id: number(),
  },
})

let statements: AdapterStatement[] = []

let fakeAdapter = {
  capabilities: {
    upsert: true,
    returning: true,
  },

  execute: async (request) => {
    statements.push(request.statement)
    // usefull for update
    if (request.statement.kind === 'select') {
      return {
        rows: [{ id: 1 }],
      }
    }

    // for insert with returning
    if (request.statement.kind === 'insert' && request.statement.returning) {
      return {
        rows: [{ id: 10 }],
      }
    }
    return {}
  },
} as DatabaseAdapter
let db = createDatabase(fakeAdapter)

describe('postgres sql-compiler', () => {
  beforeEach(() => {
    statements = []
  })

  describe('select statement', () => {
    it('compile wildcard selection', async () => {
      await db.query(accounts).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts"',
        values: [],
      })
    })

    it('compile selected', async () => {
      await db
        .query(accounts)
        .select({
          accountId: accounts.id,
          accountEmail: accounts.email,
        })
        .all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select "accounts"."id" as "accountId", "accounts"."email" as "accountEmail" from "accounts"',
        values: [],
      })
    })

    it('compile inner join', async () => {
      await db.query(accounts).join(tasks, eq(accounts.id, tasks.account_id)).all()

      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" inner join "tasks" on "accounts"."id" = "tasks"."account_id"',
        values: [],
      })
    })

    it('compile left join', async () => {
      await db.query(accounts).leftJoin(tasks, eq(accounts.id, tasks.account_id)).all()

      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" left join "tasks" on "accounts"."id" = "tasks"."account_id"',
        values: [],
      })
    })

    it('compile right join', async () => {
      await db.query(accounts).rightJoin(tasks, eq(accounts.id, tasks.account_id)).all()

      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" right join "tasks" on "accounts"."id" = "tasks"."account_id"',
        values: [],
      })
    })

    it('compile empty where', async () => {
      await db.query(accounts).where({}).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (1 = 1)',
        values: [],
      })
    })

    it('compile eq where - filled', async () => {
      await db.query(accounts).where({ status: 'enabled' }).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("status" = $1))',
        values: ['enabled'],
      })
    })

    it('compile eq where - null', async () => {
      await db.query(accounts).where({ status: null }).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("status" is null))',
        values: [],
      })
    })

    it('compile eq where - undefined', async () => {
      await db.query(accounts).where({ status: undefined }).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("status" is null))',
        values: [],
      })
    })

    it('compile ne where - filled', async () => {
      await db.query(accounts).where(ne('status', 'enabled')).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("status" <> $1)',
        values: ['enabled'],
      })
    })

    it('compile ne where - null', async () => {
      await db.query(accounts).where(ne('status', null)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("status" is not null)',
        values: [],
      })
    })

    it('compile ne where - undefined', async () => {
      await db.query(accounts).where(ne('status', undefined)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("status" is not null)',
        values: [],
      })
    })

    it('compile gt where', async () => {
      await db.query(accounts).where(gt('id', 100)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("id" > $1)',
        values: [100],
      })
    })

    it('compile gte where', async () => {
      await db.query(accounts).where(gte('id', 100)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("id" >= $1)',
        values: [100],
      })
    })

    it('compile lt where', async () => {
      await db.query(accounts).where(lt('id', 100)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("id" < $1)',
        values: [100],
      })
    })

    it('compile lte where', async () => {
      await db.query(accounts).where(lte('id', 100)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("id" <= $1)',
        values: [100],
      })
    })

    it('compile in where', async () => {
      await db
        .query(accounts)
        .where(inList('id', [100, 101]))
        .all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("id" in ($1, $2))',
        values: [100, 101],
      })
    })

    it('compile in where - empty', async () => {
      await db.query(accounts).where(inList('id', [])).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (1 = 0)',
        values: [],
      })
    })

    it('compile not in where', async () => {
      await db
        .query(accounts)
        .where(notInList('id', [100, 101]))
        .all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("id" not in ($1, $2))',
        values: [100, 101],
      })
    })

    it('compile not in where - empty', async () => {
      await db.query(accounts).where(notInList('id', [])).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (1 = 1)',
        values: [],
      })
    })

    it('compile like where', async () => {
      await db.query(accounts).where(like('status', 'ena')).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("status" like $1)',
        values: ['ena'],
      })
    })

    it('compile ilike where', async () => {
      await db.query(accounts).where(ilike('status', 'EnA')).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("status" ilike $1)',
        values: ['EnA'],
      })
    })

    it('compile between where', async () => {
      await db
        .query(accounts)
        .where(between(accounts.id, 20, 50))
        .all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("accounts"."id" between $1 and $2)',
        values: [20, 50],
      })
    })

    it('compile isNull where', async () => {
      await db.query(accounts).where(isNull(accounts.status)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("accounts"."status" is null)',
        values: [],
      })
    })

    it('compile notNull where', async () => {
      await db.query(accounts).where(notNull(accounts.status)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where ("accounts"."status" is not null)',
        values: [],
      })
    })

    it('compile logical and', async () => {
      await db.query(accounts).where({ status: 'enabled' }).where(gt(accounts.id, 10)).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("status" = $1)) and ("accounts"."id" > $2)',
        values: ['enabled', 10],
      })
    })

    it('compile logical or', async () => {
      await db
        .query(accounts)
        .where(or(eq(accounts.status, 'enabled'), eq(accounts.status, 'disabled')))
        .all()

      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("accounts"."status" = $1) or ("accounts"."status" = $2))',
        values: ['enabled', 'disabled'],
      })
    })

    it('compile nested predicates', async () => {
      await db
        .query(accounts)
        .where(
          and(
            eq(accounts.id, 1),
            or(eq(accounts.status, 'enabled'), eq(accounts.status, 'disabled')),
          ),
        )
        .all()

      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("accounts"."id" = $1) and (("accounts"."status" = $2) or ("accounts"."status" = $3)))',
        values: [1, 'enabled', 'disabled'],
      })
    })

    it('compile groupBy', async () => {
      await db.query(tasks).groupBy(tasks.account_id).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "tasks" group by "tasks"."account_id"',
        values: [],
      })
    })

    it('compile having', async () => {
      await db.query(tasks).having({ account_id: 20 }).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "tasks" having (("account_id" = $1))',
        values: [20],
      })
    })

    it('compile orderBy', async () => {
      await db.query(accounts).orderBy('id', 'asc').orderBy('email', 'desc').all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" order by "id" ASC, "email" DESC',
        values: [],
      })
    })

    it('compile pagination', async () => {
      await db.query(accounts).offset(5).limit(10).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" limit 10 offset 5',
        values: [],
      })
    })

    it('compile with boolean - true', async () => {
      await db.query(accounts).where({ deleted: true }).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("deleted" = $1))',
        values: [true],
      })
    })

    it('compile with boolean - false', async () => {
      await db.query(accounts).where({ deleted: false }).all()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select * from "accounts" where (("deleted" = $1))',
        values: [false],
      })
    })
  })

  describe('count - exists statement', () => {
    it('compile count', async () => {
      await db.query(tasks).where({ account_id: 1 }).count()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select count(*) as "count" from (select 1 from "tasks" where (("account_id" = $1))) as "__dt_count"',
        values: [1],
      })
    })

    it('compile exists', async () => {
      await db.query(tasks).where({ account_id: 1 }).exists()
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select count(*) as "count" from (select 1 from "tasks" where (("account_id" = $1))) as "__dt_count"',
        values: [1],
      })
    })
  })

  describe('insert statement', () => {
    it('compile for one', async () => {
      await db.create(accounts, {
        id: 1,
        email: 'info@remix.run',
        status: 'enabled',
      })
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" ("id", "email", "status") values ($1, $2, $3)',
        values: [1, 'info@remix.run', 'enabled'],
      })
    })

    it('compile for one and return values', async () => {
      await db.create(
        accounts,
        {
          id: 1,
          email: 'info@remix.run',
          status: 'enabled',
        },
        { returnRow: true },
      )
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" ("id", "email", "status") values ($1, $2, $3) returning *',
        values: [1, 'info@remix.run', 'enabled'],
      })
    })

    it('compile for one and return selected columns', () => {
      let compiled = compilePostgresStatement({
        kind: 'insert',
        table: accounts,
        values: {
          id: 1,
          email: 'info@remix.run',
          status: 'enabled',
        },
        returning: ['id', 'email'],
      })
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" ("id", "email", "status") values ($1, $2, $3) returning "id", "email"',
        values: [1, 'info@remix.run', 'enabled'],
      })
    })

    it('compile for one with default values', async () => {
      await db.create(accounts, {})
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" default values',
        values: [],
      })
    })

    it('compile for many', async () => {
      await db.createMany(accounts, [
        {
          id: 1,
          email: 'info@remix.run',
          status: 'enabled',
        },
        {
          id: 2,
          email: 'contact@remix.run',
          status: 'draft',
        },
      ])
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" ("id", "email", "status") values ($1, $2, $3), ($4, $5, $6)',
        values: [1, 'info@remix.run', 'enabled', 2, 'contact@remix.run', 'draft'],
      })
    })

    it('compile for many with default values', async () => {
      await db.createMany(accounts, [{}, {}])
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" default values',
        values: [],
      })
    })

    it('compile for many without data', async () => {
      await db.createMany(accounts, [])
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'select 0 where 1 = 0',
        values: [],
      })
    })
  })

  describe('update statement', () => {
    it('compile for one', async () => {
      await db.update(accounts, 1, {
        email: 'info@remix.run',
        status: 'enabled',
      })

      // is QueryBuilder's responsability to ensure entry exists in db ?
      let compiled = compilePostgresStatement(statements[1]) // statements[0] is for the initial select
      assert.deepEqual(compiled, {
        text: 'update "accounts" set "email" = $1, "status" = $2 where (("id" = $3))',
        values: ['info@remix.run', 'enabled', 1],
      })
    })

    it('compile for many', async () => {
      await db.updateMany(
        accounts,
        {
          email: 'info@remix.run',
          status: 'enabled',
        },
        {
          where: {
            status: 'disabled',
          },
        },
      )

      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'update "accounts" set "email" = $1, "status" = $2 where (("status" = $3))',
        values: ['info@remix.run', 'enabled', 'disabled'],
      })
    })
  })

  describe('upsert statement', () => {
    it('should throw without value', async () => {
      await db.query(accounts).upsert(
        {},
        {
          conflictTarget: ['id'],
        },
      )
      assert.throws(() => compilePostgresStatement(statements[0]))
    })

    it('compile with update columns', async () => {
      await db.query(accounts).upsert(
        {
          status: 'enabled',
          email: 'info@remix.run',
        },
        {
          conflictTarget: ['id'],
          update: {
            email: 'contact@remix.run',
          },
        },
      )
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" ("status", "email") values ($1, $2) on conflict ("id") do update set "email" = $3',
        values: ['enabled', 'info@remix.run', 'contact@remix.run'],
      })
    })

    it('compile without update columns', async () => {
      await db.query(accounts).upsert(
        {
          status: 'enabled',
          email: 'info@remix.run',
        },
        {
          conflictTarget: ['id'],
          update: {},
        },
      )
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'insert into "accounts" ("status", "email") values ($1, $2) on conflict ("id") do nothing',
        values: ['enabled', 'info@remix.run'],
      })
    })
  })

  describe('delete statement', () => {
    it('compile for one', async () => {
      await db.delete(accounts, 10)
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'delete from "accounts" where (("id" = $1))',
        values: [10],
      })
    })

    it('compile for many', async () => {
      await db.deleteMany(accounts, {
        where: {
          status: 'enabled',
        },
      })
      let compiled = compilePostgresStatement(statements[0])
      assert.deepEqual(compiled, {
        text: 'delete from "accounts" where (("status" = $1))',
        values: ['enabled'],
      })
    })
  })

  describe('raw statement', () => {
    it('compile with positional placeholders', () => {
      let compiled = compilePostgresStatement({
        kind: 'raw',
        sql: {
          text: 'select * from accounts where id = ? and status = ?',
          values: [10, 'enabled'],
        },
      })
      assert.deepEqual(compiled, {
        text: 'select * from accounts where id = $1 and status = $2',
        values: [10, 'enabled'],
      })
    })

    it('compile without placeholders', () => {
      let compiled = compilePostgresStatement({
        kind: 'raw',
        sql: {
          text: 'select now()',
          values: [],
        },
      })
      assert.deepEqual(compiled, {
        text: 'select now()',
        values: [],
      })
    })

    it('clone values array', () => {
      let values = [10]
      let compiled = compilePostgresStatement({
        kind: 'raw',
        sql: {
          text: 'select * from accounts where id = ?',
          values,
        },
      })

      values.push(20)

      assert.deepEqual(compiled, {
        text: 'select * from accounts where id = $1',
        values: [10],
      })
    })
  })
})
