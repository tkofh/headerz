import type { Duration } from '../duration'
import type { DirectiveBag } from './bag'

export class DirectiveParser<
  Bag extends DirectiveBag<Record<string, boolean | Duration>>,
  Directives = Bag extends DirectiveBag<infer T> ? T : never,
> {
  private readonly directives: Set<keyof Directives & string>
  constructor(
    private readonly ctor: (directives: Partial<Directives>) => Bag,
    orderedDirectives: ReadonlyArray<keyof Directives & string>,
  ) {
    this.directives = new Set(orderedDirectives)
  }

  parse(value: string): Bag {
    const map = this.toMap(value, false)

    const result: Partial<Directives> = {}
    for (const directive of this.directives) {
      if (map.has(directive)) {
        result[directive] = map.get(directive) as never
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

    if (!(this.directives as Set<string>).has(key)) {
      throw new Error(`Unknown directive: ${key}`)
    }
  }

  private toMap(input: string, strict: boolean): Map<string, number | boolean> {
    const result = new Map<string, number | boolean>()

    for (const directive of input.split(',')) {
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
