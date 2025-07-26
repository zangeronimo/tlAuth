/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    company_id: {
      type: "uuid",
      notNull: true,
      references: '"companies"(id)',
      onDelete: "cascade",
    },
    name: { type: "varchar(150)", notNull: true },
    email: { type: "varchar(150)", notNull: true, unique: true },
    password_hash: { type: "varchar(255)", notNull: true },
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
  });

  pgm.createIndex("users", "email", { unique: true });
  pgm.createIndex("users", "company_id");
};

export const down = (pgm) => {
  pgm.dropTable("users");
};
