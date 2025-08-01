/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = pgm => {
  pgm.createTable('modules', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    system_id: {
      type: 'uuid',
      notNull: true,
      references: 'systems(id)',
      onDelete: 'cascade',
    },
    name: { type: 'varchar(150)', notNull: true },
    slug: { type: 'varchar(100)', notNull: true },
    description: { type: 'varchar', notNull: false },
    is_active: { type: 'SMALLINT', default: 0 },
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
    CREATE UNIQUE INDEX unique_modules_system_slug_not_deleted
    ON modules (system_id, slug)
    WHERE deleted_at IS NULL;
  `)
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => {
  pgm.dropTable('modules')
}

