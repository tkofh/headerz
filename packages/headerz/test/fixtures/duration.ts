import { describe, expect, test } from 'vitest'
import type { DirectiveBag } from '../../src/directives/bag'
import type { DurationDirective } from '../../src/directives/duration'
import type { Duration } from '../../src/duration'
import type { KeysOfType } from '../../src/utils/types'

export function describeDurationDirective<
  Bag extends DirectiveBag<Record<string, boolean | Duration>>,
  Key extends KeysOfType<Bag, number | false>,
  Directives extends Record<string, unknown> = Bag extends DirectiveBag<infer T>
    ? T
    : never,
>(
  ctor: (input: Partial<Directives>) => Bag,
  key: Key,
  directive: DurationDirective<Bag>,
) {
  describe(key, () => {
    test('set', () => {
      expect(directive.set(ctor({}), 100).toString()).toEqual(
        ctor({ [key]: 100 } as Partial<Directives>).toString(),
      )
      expect(directive.set(ctor({}), { seconds: 100 }).toString()).toEqual(
        ctor({ [key]: 100 } as Partial<Directives>).toString(),
      )
      expect(directive.set(ctor({}), 'seconds', 100).toString()).toEqual(
        ctor({ [key]: 100 } as Partial<Directives>).toString(),
      )
      expect(directive.set(ctor({}), false).toString()).toEqual(
        ctor({ [key]: false } as Partial<Directives>).toString(),
      )

      expect(
        directive
          .set(ctor({ [key]: 100 } as Partial<Directives>), 200)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: 100 } as Partial<Directives>), {
            seconds: 200,
          })
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: 100 } as Partial<Directives>), 'seconds', 200)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: 100 } as Partial<Directives>), false)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())

      expect(
        directive
          .set(ctor({ [key]: { seconds: 100 } } as Partial<Directives>), 200)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: { seconds: 100 } } as Partial<Directives>), {
            seconds: 200,
          })
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(
            ctor({ [key]: { seconds: 100 } } as Partial<Directives>),
            'seconds',
            200,
          )
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: { seconds: 100 } } as Partial<Directives>), false)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())

      expect(
        directive
          .set(ctor({ [key]: false } as Partial<Directives>), 200)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: false } as Partial<Directives>), {
            seconds: 200,
          })
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: false } as Partial<Directives>), 'seconds', 200)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .set(ctor({ [key]: false } as Partial<Directives>), false)
          .toString(),
      ).toEqual(ctor({ [key]: false } as Partial<Directives>).toString())
    })

    test('withMin', () => {
      expect(
        directive
          .withMin(ctor({ [key]: 50 } as Partial<Directives>), 100)
          .toString(),
      ).toEqual(ctor({ [key]: 100 } as Partial<Directives>).toString())
      expect(
        directive
          .withMin(ctor({ [key]: 150 } as Partial<Directives>), 100)
          .toString(),
      ).toEqual(ctor({ [key]: 150 } as Partial<Directives>).toString())
    })

    test('withMax', () => {
      expect(
        directive
          .withMax(ctor({ [key]: 50 } as Partial<Directives>), 100)
          .toString(),
      ).toEqual(ctor({ [key]: 50 } as Partial<Directives>).toString())
      expect(
        directive
          .withMax(ctor({ [key]: 150 } as Partial<Directives>), 100)
          .toString(),
      ).toEqual(ctor({ [key]: 100 } as Partial<Directives>).toString())
    })

    test('clamp', () => {
      expect(
        directive
          .clamp(ctor({ [key]: 50 } as Partial<Directives>), 100, 200)
          .toString(),
      ).toEqual(ctor({ [key]: 100 } as Partial<Directives>).toString())
      expect(
        directive
          .clamp(ctor({ [key]: 150 } as Partial<Directives>), 100, 200)
          .toString(),
      ).toEqual(ctor({ [key]: 150 } as Partial<Directives>).toString())
      expect(
        directive
          .clamp(ctor({ [key]: 250 } as Partial<Directives>), 100, 200)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
    })

    test('offset', () => {
      expect(
        directive
          .offset(ctor({ [key]: 100 } as Partial<Directives>), 100)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .offset(ctor({ [key]: 100 } as Partial<Directives>), 0)
          .toString(),
      ).toEqual(ctor({ [key]: 100 } as Partial<Directives>).toString())
      expect(
        directive
          .offset(ctor({ [key]: 100 } as Partial<Directives>), -150)
          .toString(),
      ).toEqual(ctor({ [key]: 0 } as Partial<Directives>).toString())
    })

    test('scale', () => {
      expect(
        directive
          .scale(ctor({ [key]: 100 } as Partial<Directives>), 2)
          .toString(),
      ).toEqual(ctor({ [key]: 200 } as Partial<Directives>).toString())
      expect(
        directive
          .scale(ctor({ [key]: 100 } as Partial<Directives>), 0.5)
          .toString(),
      ).toEqual(ctor({ [key]: 50 } as Partial<Directives>).toString())
      expect(
        directive
          .scale(ctor({ [key]: 100 } as Partial<Directives>), 0)
          .toString(),
      ).toEqual(ctor({ [key]: 0 } as Partial<Directives>).toString())
      expect(
        directive
          .scale(ctor({ [key]: 100 } as Partial<Directives>), -0.5)
          .toString(),
      ).toEqual(ctor({ [key]: 0 } as Partial<Directives>).toString())
    })
  })
}
