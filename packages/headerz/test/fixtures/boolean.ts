import { describe, expect, test } from 'vitest'
import type { ValuesOf } from '../../src/directive'
import type {
  BooleanDirective,
  BooleanOperations,
} from '../../src/directives/boolean'
import type { HeaderFactory } from '../../src/header'
import type { KeysOfType } from '../../src/utils/types'

export function describeBooleanDirective<
  const Factory extends HeaderFactory,
  Inputs extends ValuesOf<Directives>,
  Key extends KeysOfType<Inputs, boolean>,
  Directives extends BooleanDirective<
    string,
    string
  > = Factory extends HeaderFactory<infer D>
    ? Extract<D, BooleanDirective<string, string>>
    : never,
>(factory: Factory, key: Key) {
  describe(key, () => {
    test('set', () => {
      expect(factory[key].set(factory({}), true).toString()).toEqual(
        factory({ [key]: true }).toString(),
      )
      expect(
        factory[key].set(factory({ [key]: false }), true).toString(),
      ).toEqual(factory({ [key]: true }).toString())

      expect(
        factory({})
          .pipe((factory[key] as BooleanOperations<string>).set(true))
          .toString(),
      ).toEqual(factory({ [key]: true }).toString())
      expect(
        factory({ [key]: false })
          .pipe((factory[key] as BooleanOperations<string>).set(true))
          .toString(),
      ).toEqual(factory({ [key]: true }).toString())
    })

    test('negate', () => {
      expect(factory[key].negate(factory({ [key]: true })).toString()).toEqual(
        factory({ [key]: false }).toString(),
      )

      expect(factory[key].negate(factory({ [key]: false })).toString()).toEqual(
        factory({ [key]: true }).toString(),
      )

      expect(
        factory[key]
          .negate(
            factory({
              [key]: undefined,
            }),
          )
          .toString(),
      ).toEqual(factory({ [key]: true }).toString())
    })

    test('or', () => {
      expect(factory[key].or(factory({}), true).toString()).toEqual(
        factory({ [key]: true }).toString(),
      )
      expect(
        factory[key].or(factory({ [key]: true }), true).toString(),
      ).toEqual(factory({ [key]: true }).toString())

      expect(
        factory[key].or(factory({ [key]: false }), true).toString(),
      ).toEqual(factory({ [key]: true }).toString())

      expect(
        factory[key].or(factory({ [key]: false }), false).toString(),
      ).toEqual(factory({ [key]: false }).toString())
    })

    test('and', () => {
      expect(factory[key].and(factory({}), true).toString()).toEqual(
        factory({ [key]: false }).toString(),
      )
      expect(
        factory[key].and(factory({ [key]: true }), true).toString(),
      ).toEqual(factory({ [key]: true }).toString())

      expect(
        factory[key].and(factory({ [key]: false }), true).toString(),
      ).toEqual(factory({ [key]: false }).toString())

      expect(
        factory[key].and(factory({ [key]: false }), false).toString(),
      ).toEqual(factory({ [key]: false }).toString())
    })

    test('xor', () => {
      expect(factory[key].xor(factory({}), true).toString()).toEqual(
        factory({ [key]: true }).toString(),
      )
      expect(
        factory[key].xor(factory({ [key]: true }), true).toString(),
      ).toEqual(factory({ [key]: false }).toString())

      expect(
        factory[key].xor(factory({ [key]: false }), true).toString(),
      ).toEqual(factory({ [key]: true }).toString())

      expect(
        factory[key].xor(factory({ [key]: false }), false).toString(),
      ).toEqual(factory({ [key]: false }).toString())
    })
  })
}
