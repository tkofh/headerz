import type {
  AnyDirective,
  DirectivesList,
  InputsOf,
  OperationsOf,
  ValuesOf,
} from './directive'
import { type FinalMapFn, type MapFn, pipe } from './utils/function'
import { hasProperty, isRecord } from './utils/predicates'

const HeaderTypeBrand: unique symbol = Symbol.for('headerz')
type HeaderTypeBrand = typeof HeaderTypeBrand

export type HeaderFactory<Directives extends AnyDirective = AnyDirective> = (<
  D extends Partial<InputsOf<Directives>>,
>(
  directives: D,
) => Header<ValuesOf<Directives>>) &
  OperationsOf<Directives> & {
    hasInstance(value: unknown): value is Header<ValuesOf<Directives>>
    parse(value: string): Header<ValuesOf<Directives>>
    normalize(value: string): string
    validate(value: string): boolean
  }

export interface Header<Directives extends Record<string, unknown>> {
  readonly directives: Partial<Directives>

  with<
    const Directive extends keyof Directives,
    const Value extends Directives[Directive] | undefined,
  >(directive: Directive, value: Value): this
  pipe<R>(
    ...fns: [
      ...Array<MapFn<Header<Directives>>>,
      FinalMapFn<Header<Directives>, R>,
    ]
  ): R

  toHeaderString(): string

  toValueString(): string
}

export type HeaderInputs<H> = H extends HeaderFactory<infer D>
  ? InputsOf<D>
  : never

interface HeaderOptions<Directives extends AnyDirective> {
  separator: string
  transform: (
    directives: Partial<ValuesOf<Directives>>,
  ) => Partial<ValuesOf<Directives>>
}

export function createHeader<const Definitions extends DirectivesList>(
  name: string,
  definitions: Definitions,
  options: HeaderOptions<Definitions[number]>,
): HeaderFactory<Definitions[number]> {
  const TypeBrand: unique symbol = Symbol.for(`headerz.${name}`)
  type TypeBrand = typeof TypeBrand

  const header = class implements Header<Record<string, unknown>> {
    static readonly name = name
    readonly [HeaderTypeBrand]: HeaderTypeBrand = HeaderTypeBrand
    readonly [TypeBrand]: TypeBrand = TypeBrand
    readonly name = name
    readonly directives: Partial<Record<string, unknown>>

    constructor(input: Partial<Record<string, unknown>> = {}) {
      for (const directive of definitions) {
        const directiveName = directive.name
        if (hasProperty(input, directiveName)) {
          const directiveValue = input[directiveName]
          if (!directive.validate(directiveValue)) {
            throw new TypeError(
              `Invalid value for ${directive.name}: ${directiveValue}`,
            )
          }
        }
      }
      this.directives = options.transform(
        input as ValuesOf<Definitions[number]>,
      )
    }

    static [Symbol.hasInstance](value: unknown) {
      return (
        isRecord(value) &&
        hasProperty(value, TypeBrand) &&
        value[TypeBrand] === TypeBrand
      )
    }

    with(directive: string, value: unknown): this {
      if (value === undefined) {
        if (!hasProperty(this.directives, directive)) {
          return this
        }

        const { [directive]: _, ...rest } = this.directives
        return new header(rest as Record<string, unknown>) as unknown as this
      }

      return new header({
        ...this.directives,
        [directive]: value,
      }) as unknown as this
    }

    pipe<A extends Header<Record<string, unknown>>, R>(
      ...fns: [...Array<MapFn<A>>, FinalMapFn<A, R>]
    ): R {
      return pipe(this as unknown as A, ...fns)
    }

    toHeaderString(): string {
      return `${this.name}: ${this.toValueString()}`
    }

    toValueString(): string {
      const results: Array<string> = []
      for (const directive of definitions) {
        if (
          hasProperty(this.directives, directive.key) &&
          this.directives[directive.key] !== undefined &&
          this.directives[directive.key] !== false
        ) {
          const result = directive.stringify(
            this.directives[directive.key],
            directive,
          )
          if (result !== null) {
            results.push(result)
          }
        }
      }
      return results.join(options.separator)
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
      return this.toHeaderString()
    }
  }

  const operations = {} as Record<string, unknown>
  for (const directive of definitions) {
    operations[directive.key] = directive.operations
  }

  const toMap = (input: string, strict: boolean): Record<string, unknown> => {
    const result = {} as Record<string, unknown>

    const seen = new Set<string>()

    for (const raw of input
      .replace(new RegExp(`^${name}:`), '')
      .trim()
      .split(options.separator)) {
      const segment = raw.trim()
      for (const directive of definitions) {
        if (segment.startsWith(directive.name)) {
          if (strict && seen.has(directive.key)) {
            throw new Error(`Duplicate directive: ${directive.key}`)
          }
          seen.add(directive.key)
          result[directive.key] = directive.parse(segment)
        }
      }
    }

    return result
  }

  const hasInstance = (value: unknown) => value instanceof header
  const parse = (input: string) => {
    return new header(toMap(input.toLowerCase().trim(), false))
  }
  const normalize = (input: string) => {
    const result = parse(input.toLowerCase().trim())

    return input.startsWith(name)
      ? result.toHeaderString()
      : result.toValueString()
  }
  const validate = (input: string) => {
    try {
      toMap(input.toLowerCase().trim(), true)
      return true
    } catch {
      return false
    }
  }

  Object.assign(operations, {
    hasInstance,
    parse,
    normalize,
    validate,
  })

  return Object.assign((inputs: Record<string, unknown>) => {
    const directives = {} as Record<string, unknown>
    for (const directive of definitions) {
      if (hasProperty(inputs, directive.key)) {
        directives[directive.key] = directive.translate(inputs[directive.key])
      }
    }
    return new header(directives)
  }, operations) as never
}

export function isHeader<Directives extends Record<string, unknown>>(
  value: unknown,
): value is Header<Directives> {
  return (
    isRecord(value) &&
    hasProperty(value, HeaderTypeBrand) &&
    value[HeaderTypeBrand] === HeaderTypeBrand
  )
}
