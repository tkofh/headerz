import { describe, expect, test } from 'vitest'
import type { DirectiveBag } from '../../src/directives/bag'
import type { BooleanDirective } from '../../src/directives/boolean'
import type { Duration } from '../../src/duration'
import type { KeysOfType } from '../../src/utils/types'

export function describeBooleanDirective<
  Bag extends DirectiveBag<Record<string, boolean | Duration>>,
  Key extends KeysOfType<Bag, boolean>,
  Directives extends Record<string, unknown> = Bag extends DirectiveBag<infer T>
    ? T
    : never,
>(
  ctor: (input: Partial<Directives>) => Bag,
  key: Key,
  directive: BooleanDirective<Bag>,
) {
  describe(key, () => {
    test('set', () => {
      expect(directive.set(ctor({}), true).toString()).toEqual(
        ctor({ [key]: true } as Partial<Directives>).toString(),
      )
      expect(
        directive
          .set(ctor({ [key]: false } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())

      expect(
        ctor({})
          .pipe(directive.set(true) as unknown as (bag: Bag) => Bag)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())
      expect(
        ctor({ [key]: false } as Partial<Directives>)
          .pipe(directive.set(true) as unknown as (bag: Bag) => Bag)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())
    })

    test('negate', () => {
      expect(
        directive
          .negate(ctor({ [key]: true } as Partial<Directives>))
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())

      expect(
        directive
          .negate(ctor({ [key]: false } as Partial<Directives>))
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())

      expect(
        directive
          .negate(
            ctor({
              [key]: undefined,
            } as Partial<Directives>),
          )
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())
    })

    test('or', () => {
      expect(directive.or(ctor({}), true).toString()).toEqual(
        ctor({ [key]: true } as Partial<Directives>).toString(),
      )
      expect(
        directive
          .or(ctor({ [key]: true } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())

      expect(
        directive
          .or(ctor({ [key]: false } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())

      expect(
        directive
          .or(ctor({ [key]: false } as Partial<Directives>), false)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())
    })

    test('and', () => {
      expect(directive.and(ctor({}), true).toString()).toEqual(
        ctor({ [key]: false } as Partial<Directives>).toString(),
      )
      expect(
        directive
          .and(ctor({ [key]: true } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())

      expect(
        directive
          .and(ctor({ [key]: false } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())

      expect(
        directive
          .and(ctor({ [key]: false } as Partial<Directives>), false)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())
    })

    test('xor', () => {
      expect(directive.xor(ctor({}), true).toString()).toEqual(
        ctor({ [key]: true } as Partial<Directives>).toString(),
      )
      expect(
        directive
          .xor(ctor({ [key]: true } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())

      expect(
        directive
          .xor(ctor({ [key]: false } as Partial<Directives>), true)
          .toString(),
      ).toEqual(ctor({ [key]: true } as Partial<Directives>).toString())

      expect(
        directive
          .xor(ctor({ [key]: false } as Partial<Directives>), false)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())
    })
  })
}
