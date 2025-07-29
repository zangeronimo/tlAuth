/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined

export const up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'varchar(150)', notNull: true },
    email: { type: 'varchar(150)', notNull: true },
    is_active: { type: 'SMALLINT', default: 1 },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'timestamp',
      notNull: false,
      default: null,
    },
  })

  pgm.sql(`
    CREATE UNIQUE INDEX unique_email_not_deleted
    ON users (email)
    WHERE deleted_at IS NULL;
  `)
}

export const down = pgm => {
  pgm.dropTable('users')
}

