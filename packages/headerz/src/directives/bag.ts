import type { Duration } from '../duration'
import { type FinalMapFn, type MapFn, pipe } from '../utils/function'
import { hasProperty, isRecord } from '../utils/predicates'

const TypeBrand: unique symbol = Symbol.for('headerz.directive-bag')
type TypeBrand = typeof TypeBrand

export class DirectiveBag<
  Directives extends { [k: string]: boolean | Duration },
> {
  readonly [TypeBrand]: TypeBrand = TypeBrand
  private stringified: string | undefined

  constructor(protected readonly directives: Partial<Directives> = {}) {}

  protected get order(): ReadonlyArray<keyof Directives & string> {
    return []
  }

  protected get separator(): string {
    return ','
  }

  static [Symbol.hasInstance](value: unknown) {
    return isDirectiveBag(value)
  }

  pipe<A extends this = this, R = this>(
    ...fns: [...Array<MapFn<A>>, FinalMapFn<A, R>]
  ): R {
    return pipe(this as A, ...fns)
  }

  with<Directive extends keyof Directives>(
    directive: Directive,
    value: Directives[Directive],
  ): this {
    return this.instance({
      ...this.directives,
      [directive]: value,
    })
  }

  toString(): string {
    if (this.stringified === undefined) {
      const directives: Array<string> = []
      for (const directive of this.order) {
        if (
          this.directives[directive] !== undefined &&
          this.directives[directive] !== false
        ) {
          if (this.directives[directive] === true) {
            directives.push(directive)
          } else {
            directives.push(`${directive}=${this.directives[directive]}`)
          }
        }
      }
      this.stringified = directives.join(this.separator)
    }

    return this.stringified
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toString()
  }

  protected instance(directives: Partial<Directives>): this {
    return new DirectiveBag(directives) as this
  }
}

export function isDirectiveBag<
  Directives extends Record<string, boolean | Duration>,
>(value: unknown): value is DirectiveBag<Directives> {
  return (
    isRecord(value) &&
    hasProperty(value, TypeBrand) &&
    value[TypeBrand] === TypeBrand
  )
}
