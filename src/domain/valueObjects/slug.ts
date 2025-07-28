export class Slug {
  readonly value?: string

  constructor(slug: string) {
    this.value = slug
  }

  static create = (name: string) => {
    const slug = name.noAccents().toLowerCase().replaceAll(' ', '-')
    return new Slug(slug)
  }

  static restore = (slug: string) => {
    return new Slug(slug)
  }
}

