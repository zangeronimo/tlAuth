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
  pgm.createTable('company_systems', {
    company_id: {
      type: 'uuid',
      notNull: true,
      references: 'companies(id)',
      onDelete: 'cascade',
    },
    system_id: {
      type: 'uuid',
      notNull: true,
      references: 'systems(id)',
      onDelete: 'cascade',
    },
  })

  pgm.addConstraint('company_systems', 'pk_company_systems', {
    primaryKey: ['company_id', 'system_id'],
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = pgm => {
  pgm.dropTable('company_systems')
}

