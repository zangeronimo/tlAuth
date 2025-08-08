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
  pgm.createTable('user_credentials', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade',
    },
    system_id: {
      type: 'uuid',
      notNull: true,
      references: 'systems(id)',
      onDelete: 'cascade',
    },
    password_hash: { type: 'text', notNull: true },
    password_salt: { type: 'text', notNull: true },
    is_active: { type: 'SMALLINT', default: 1 },
    last_login_at: {
      type: 'timestamp',
      notNull: false,
      default: null,
    },
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

  pgm.createIndex('user_credentials', ['system_id', 'user_id'], {
    name: 'ux_user_credentials_system_user_active',
    unique: true,
    where: 'deleted_at IS NULL',
  })
}

export const down = pgm => {
  pgm.dropTable('user_credentials')
}

