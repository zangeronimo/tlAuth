/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  pgm.createTable("companies", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(150)", notNull: true },
    slug: { type: "varchar(100)", notNull: true, unique: true },
    is_active: { type: "boolean", default: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deleted_at: {
      type: "timestamp",
      notNull: false,
      default: null,
    },
  });

  pgm.createIndex("companies", "slug", { unique: true });
};

export const down = (pgm) => {
  pgm.dropTable("companies");
};
