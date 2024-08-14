import { describe, expect, test } from 'vitest'
import type { ValuesOf } from '../../src/directive'
import type { BooleanDirective } from '../../src/directives/boolean'
import type { DurationDirective } from '../../src/directives/duration'
import type { HeaderFactory } from '../../src/header'
import type { Duration } from '../../src/toNumber'
import type { KeysOfType } from '../../src/utils/types'

export function describeDurationDirective<
  const Factory extends HeaderFactory,
  Inputs extends ValuesOf<Directives>,
  Key extends KeysOfType<Inputs, Duration>,
  Directives extends DurationDirective<
    string,
    string
  > = Factory extends HeaderFactory<infer D>
    ? Extract<D, BooleanDirective<string, string>>
    : never,
>(factory: Factory, key: Key) {
  describe(key, () => {
    test('set', () => {
      expect(factory[key].set(factory({}), 100).toString()).toEqual(
        factory({ [key]: 100 }).toString(),
      )
      expect(
        factory[key].set(factory({}), { seconds: 100 }).toString(),
      ).toEqual(factory({ [key]: 100 }).toString())
      expect(factory[key].set(factory({}), 'seconds', 100).toString()).toEqual(
        factory({ [key]: 100 }).toString(),
      )
      // expect(factory[key].set(factory({}), false).toString()).toEqual(
      //   factory({ [key]: false }).toString(),
      // )

      expect(factory[key].set(factory({ [key]: 100 }), 200).toString()).toEqual(
        factory({ [key]: 200 }).toString(),
      )
      expect(
        factory[key]
          .set(factory({ [key]: 100 }), {
            seconds: 200,
          })
          .toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
      expect(
        factory[key].set(factory({ [key]: 100 }), 'seconds', 200).toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
      // expect(
      //   factory[key].set(factory({ [key]: 100 }), false).toString(),
      // ).toEqual(factory({ [key]: false }).toString())

      expect(
        factory[key].set(factory({ [key]: { seconds: 100 } }), 200).toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
      expect(
        factory[key]
          .set(factory({ [key]: { seconds: 100 } }), {
            seconds: 200,
          })
          .toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
      expect(
        factory[key]
          .set(factory({ [key]: { seconds: 100 } }), 'seconds', 200)
          .toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
      // expect(
      //   factory[key]
      //     .set(factory({ [key]: { seconds: 100 } }), false)
      //     .toString(),
      // ).toEqual(factory({ [key]: false }).toString())

      // expect(
      //   factory[key].set(factory({ [key]: false }), 200).toString(),
      // ).toEqual(factory({ [key]: 200 }).toString())
      // expect(
      //   factory[key]
      //     .set(factory({ [key]: false }), {
      //       seconds: 200,
      //     })
      //     .toString(),
      // ).toEqual(factory({ [key]: 200 }).toString())
      // expect(
      //   factory[key].set(factory({ [key]: false }), 'seconds', 200).toString(),
      // ).toEqual(factory({ [key]: 200 }).toString())
      // expect(
      //   factory[key].set(factory({ [key]: false }), false).toString(),
      // ).toEqual(factory({ [key]: false }).toString())
    })

    test('withMin', () => {
      expect(
        factory[key].withMin(factory({ [key]: 50 }), 100).toString(),
      ).toEqual(factory({ [key]: 100 }).toString())
      expect(
        factory[key].withMin(factory({ [key]: 150 }), 100).toString(),
      ).toEqual(factory({ [key]: 150 }).toString())
    })

    test('withMax', () => {
      expect(
        factory[key].withMax(factory({ [key]: 50 }), 100).toString(),
      ).toEqual(factory({ [key]: 50 }).toString())
      expect(
        factory[key].withMax(factory({ [key]: 150 }), 100).toString(),
      ).toEqual(factory({ [key]: 100 }).toString())
    })

    test('clamp', () => {
      expect(
        factory[key].clamp(factory({ [key]: 50 }), 100, 200).toString(),
      ).toEqual(factory({ [key]: 100 }).toString())
      expect(
        factory[key].clamp(factory({ [key]: 150 }), 100, 200).toString(),
      ).toEqual(factory({ [key]: 150 }).toString())
      expect(
        factory[key].clamp(factory({ [key]: 250 }), 100, 200).toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
    })

    test('increase', () => {
      expect(
        factory[key].increase(factory({ [key]: 100 }), 100).toString(),
      ).toEqual(factory({ [key]: 200 }).toString())
      expect(
        factory[key].increase(factory({ [key]: 100 }), 0).toString(),
      ).toEqual(factory({ [key]: 100 }).toString())
    })

    test('decrease', () => {
      expect(
        factory[key].decrease(factory({ [key]: 100 }), 100).toString(),
      ).toEqual(factory({ [key]: 0 }).toString())
      expect(
        factory[key].decrease(factory({ [key]: 100 }), 0).toString(),
      ).toEqual(factory({ [key]: 100 }).toString())
      expect(
        factory[key].decrease(factory({ [key]: 100 }), 200).toString(),
      ).toEqual(factory({ [key]: 0 }).toString())
    })

    test('scale', () => {
      expect(factory[key].scale(factory({ [key]: 100 }), 2).toString()).toEqual(
        factory({ [key]: 200 }).toString(),
      )
      expect(
        factory[key].scale(factory({ [key]: 100 }), 0.5).toString(),
      ).toEqual(factory({ [key]: 50 }).toString())
      expect(factory[key].scale(factory({ [key]: 100 }), 0).toString()).toEqual(
        factory({ [key]: 0 }).toString(),
      )
      expect(
        factory[key].scale(factory({ [key]: 100 }), -0.5).toString(),
      ).toEqual(factory({ [key]: 0 }).toString())
    })
  })
}
