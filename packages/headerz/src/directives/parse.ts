import type { Duration } from '../duration'
import type { Header } from '../header'

export class DirectiveParser<
  Bag extends Header<Record<string, boolean | Duration>>,
  Directives = Bag extends Header<infer T> ? T : never,
> {
  constructor(
    private readonly ctor: (directives: Partial<Directives>) => Bag,
    private readonly lookup: ReadonlyMap<string, keyof Directives & string>,
    private readonly separator: string = ',',
  ) {}

  parse(value: string): Bag {
    const map = this.toMap(value, false)

    const result: Partial<Directives> = {}
    for (const [key, directive] of this.lookup) {
      if (map.has(key)) {
        result[directive] = map.get(key) as never
      }
    }

    return this.ctor(result) as unknown as Bag
  }

  validate(value: string): boolean {
    try {
      this.toMap(value, true)
      return true
    } catch {
      return false
    }
  }

  normalize(value: string): string {
    const result = this.parse(value)

    return result.toString()
  }

  private validateKey(key: string) {
    if (key === '') {
      throw new Error('Empty directive')
    }

    if (/\s/.test(key)) {
      throw new Error(`Invalid directive: ${key}`)
    }

    if (!this.lookup.has(key)) {
      throw new Error(`Unknown directive: ${key}`)
    }
  }

  private toMap(input: string, strict: boolean): Map<string, number | boolean> {
    const result = new Map<string, number | boolean>()

    for (const directive of input.split(this.separator)) {
      const [name, value] = directive.split('=') as [string, string | undefined]
      const key = name.trim().toLowerCase()

      if (strict) {
        this.validateKey(key)

        if (result.has(key)) {
          throw new Error(`Duplicate directive: ${key}`)
        }
      }

      if (value === undefined) {
        result.set(name.trim().toLowerCase(), true)
      } else {
        const parsed = Number.parseInt(value, 10)
        if (Number.isFinite(parsed)) {
          result.set(name.trim().toLowerCase(), parsed)
        }
      }
    }

    return result
  }
}
