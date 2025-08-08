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
  pgm.createTable('company_modules', {
    company_id: {
      type: 'uuid',
      notNull: true,
      references: 'companies(id)',
      onDelete: 'cascade',
    },
    module_id: {
      type: 'uuid',
      notNull: true,
      references: 'modules(id)',
      onDelete: 'cascade',
    },
  })

  pgm.addConstraint('company_modules', 'pk_company_modules', {
    primaryKey: ['company_id', 'module_id'],
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = pgm => {
  pgm.dropTable('company_modules')
}

