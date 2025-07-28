export class StringExtensions {
  static noAccents = Object.defineProperty(String.prototype, 'noAccents', {
    value: function noAccents() {
      return this.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    },
    writable: true,
    configurable: true,
  })
}

