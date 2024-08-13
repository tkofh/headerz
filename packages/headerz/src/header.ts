import type { Directive, DirectivesFrom, OperationsFrom } from './directive'
import { type FinalMapFn, type MapFn, pipe } from './utils/function'
import { hasProperty } from './utils/predicates'
import type { Identity } from './utils/types'

export interface HeaderConstructor<Directives> {
  new (directives: Partial<Directives>): Header<Directives>
}

export type HeaderFactory<
  Directives extends ReadonlyArray<Directive<string, string, unknown>>,
> = ((directives: Partial<DirectivesFrom<Directives>>) => Header<Directives>) &
  OperationsFrom<Directives>

export interface Header<Directives> {
  readonly directives: Partial<Directives>

  with<Directive extends keyof Directives>(
    directive: Directive,
    value: Directives[Directive] | undefined,
  ): this
  pipe<R = this>(...fns: [...Array<MapFn<this>>, FinalMapFn<this, R>]): R

  toHeaderString(): string

  toValueString(): string
}

interface HeaderOptions<Directives> {
  separator: string
  transform: (directives: Identity<Directives>) => Identity<Directives>
}

export function createHeader<
  const Definitions extends ReadonlyArray<Directive<string, string, unknown>>,
>(
  name: string,
  definitions: Definitions,
  options: HeaderOptions<DirectivesFrom<Definitions>>,
): HeaderFactory<Definitions> {
  const TypeBrand: unique symbol = Symbol.for(`headerz.${name}}`)
  type TypeBrand = typeof TypeBrand

  const header = class implements Header<DirectivesFrom<Definitions>> {
    readonly [TypeBrand]: TypeBrand = TypeBrand

    readonly name = name
    readonly directives: Partial<DirectivesFrom<Definitions>>

    constructor(input: Partial<DirectivesFrom<Definitions>> = {}) {
      for (const directive of definitions) {
        const directiveName = directive.name
        if (hasProperty(input, directiveName)) {
          const directiveValue = input[directiveName]
          if (!directive.validate(directiveValue, directive)) {
            throw new TypeError(
              `Invalid value for ${directive.name}: ${directiveValue}`,
            )
          }
        }
      }
      this.directives = options.transform(input)
    }

    with<Directive extends keyof DirectivesFrom<Definitions>>(
      directive: Directive,
      value: DirectivesFrom<Definitions>[Directive] | undefined,
    ): this {
      if (value === undefined) {
        if (!hasProperty(this.directives, directive)) {
          return this
        }

        const { [directive]: _, ...rest } = this.directives
        return new header(
          rest as Partial<DirectivesFrom<Definitions>>,
        ) as unknown as this
      }

      return new header({
        ...this.directives,
        [directive]: value,
      }) as unknown as this
    }

    pipe<R = this>(...fns: [...Array<MapFn<this>>, FinalMapFn<this, R>]): R {
      return pipe(this, ...fns)
    }

    toHeaderString(): string {
      return `${this.name}: ${this.toValueString()}`
    }

    toValueString(): string {
      const results: Array<string> = []
      for (const directive of definitions) {
        const directiveName = directive.name
        if (
          hasProperty(this.directives, directiveName) &&
          this.directives[directiveName] !== undefined &&
          this.directives[directiveName] !== false
        ) {
          const result = directive.stringify(
            this.directives[directiveName],
            directive,
          )
          if (result !== null) {
            results.push(result)
          }
        }
      }
      return results.join(options.separator)
    }
  }

  Object.defineProperty(header, 'name', { value: name })

  const operations = {} as Record<string, unknown>
  for (const directive of definitions) {
    operations[directive.key] = directive.operations
  }

  return Object.assign(
    (directives: Partial<DirectivesFrom<Definitions>>) =>
      new header(directives) as unknown as Header<DirectivesFrom<Definitions>>,
    operations,
  ) as never
}

//
// export class Header<Directives> {
//   readonly [TypeBrand]: TypeBrand = TypeBrand
//   protected lookup: ReadonlyMap<keyof Directives & string, string> =
//     defaultLookup
//   private stringified: string | undefined
//
//   constructor(protected readonly directives: Partial<Directives> = {}) {}
//
//   protected get separator(): string {
//     return ','
//   }
//
//   static [Symbol.hasInstance](value: unknown) {
//     return isHeader(value)
//   }
//
//   pipe<A extends this = this, R = this>(
//     ...fns: [...Array<MapFn<A>>, FinalMapFn<A, R>]
//   ): R {
//     return pipe(this as A, ...fns)
//   }
//
//   with<Directive extends keyof Directives>(
//     directive: Directive,
//     value: Directives[Directive],
//   ): this {
//     return this.instance({
//       ...this.directives,
//       [directive]: value,
//     })
//   }
//
//   toString(): string {
//     if (this.stringified === undefined) {
//       const directives: Array<string> = []
//       for (const [key, directive] of this.lookup) {
//         if (
//           this.directives[key] !== undefined &&
//           this.directives[key] !== false
//         ) {
//           if (this.directives[key] === true) {
//             directives.push(directive)
//           } else {
//             directives.push(`${directive}=${this.directives[key]}`)
//           }
//         }
//       }
//       this.stringified = directives.join(this.separator)
//     }
//
//     return this.stringified
//   }
//
//   [Symbol.for('nodejs.util.inspect.custom')]() {
//     return this.toString()
//   }
//
//   protected instance(directives: Partial<Directives>): this {
//     return new Header(directives) as this
//   }
// }
//
// export function isHeader<Directives extends Record<string, boolean | Duration>>(
//   value: unknown,
// ): value is Header<Directives> {
//   return (
//     isRecord(value) &&
//     hasProperty(value, TypeBrand) &&
//     value[TypeBrand] === TypeBrand
//   )
// }
