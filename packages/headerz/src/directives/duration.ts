import { type Duration, type DurationUnit, duration } from '../duration'
import { dual } from '../utils/function'
import { isNumber, isString } from '../utils/predicates'
import type { KeysOfType } from '../utils/types'
import { DirectiveBag } from './bag'

export class DurationDirective<
  Bag extends DirectiveBag<Record<string, boolean | Duration>>,
> {
  readonly set: {
    <Self extends Bag>(self: Self, value: Duration | false): Self
    <Self extends Bag>(self: Self, unit: DurationUnit, value: number): Self
    <Self extends Bag>(value: Duration | false): (self: Self) => Self
    <Self extends Bag>(unit: DurationUnit, value: number): (self: Self) => Self
  } = dual(
    (args) => args[0] instanceof DirectiveBag,
    function <Self extends Bag>(
      this: DurationDirective<Self>,
      self: Self,
      valueOrUnit: Duration | false | DurationUnit,
      value?: number,
    ) {
      if (valueOrUnit === false) {
        return self.with(this.name, false)
      }

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        return self.with(
          this.name,
          duration(valueOrUnit as DurationUnit, value),
        )
      }

      return self.with(this.name, duration(valueOrUnit))
    }.bind(this),
  )
  readonly withMin: {
    <Self extends Bag>(self: Self, value: Duration): Self
    <Self extends Bag>(self: Self, unit: DurationUnit, value: number): Self
    <Self extends Bag>(value: Duration): (self: Self) => Self
    <Self extends Bag>(unit: DurationUnit, value: number): (self: Self) => Self
  } = dual(
    (args) => args[0] instanceof DirectiveBag,
    function <Self extends Bag>(
      this: DurationDirective<Self>,
      self: Self,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) {
      let min: number

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        min = duration(valueOrUnit as DurationUnit, value)
      } else {
        min = duration(valueOrUnit)
      }

      const current = self[this.name] as number | false

      if (current === false) {
        return self.with(this.name, min)
      }

      return self.with(this.name, Math.max(current, min))
    }.bind(this),
  )
  readonly withMax: {
    <Self extends Bag>(self: Self, value: Duration): Self
    <Self extends Bag>(self: Self, unit: DurationUnit, value: number): Self
    <Self extends Bag>(value: Duration): (self: Self) => Self
    <Self extends Bag>(unit: DurationUnit, value: number): (self: Self) => Self
  } = dual(
    (args) => args[0] instanceof DirectiveBag,
    function <Self extends Bag>(
      this: DurationDirective<Self>,
      self: Self,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) {
      let max: number

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        max = duration(valueOrUnit as DurationUnit, value)
      } else {
        max = duration(valueOrUnit)
      }

      const current = self[this.name] as number | false

      if (current === false) {
        return self.with(this.name, max)
      }

      return self.with(this.name, Math.min(current, max))
    }.bind(this),
  )
  readonly clamp: {
    <Self extends Bag>(self: Self, min: Duration, max: Duration): Self
    <Self extends Bag>(
      self: Self,
      unit: DurationUnit,
      min: number,
      max: number,
    ): Self
    <Self extends Bag>(min: Duration, max: Duration): (self: Self) => Self
    <Self extends Bag>(
      unit: DurationUnit,
      min: number,
      max: number,
    ): (self: Self) => Self
  } = dual(
    (args) => args[0] instanceof DirectiveBag,
    function <Self extends Bag>(
      this: DurationDirective<Self>,
      self: Self,
      minOrUnit: Duration | DurationUnit,
      min?: number | Duration,
      max?: number,
    ) {
      let minValue: number
      let maxValue: number

      if (isString(minOrUnit)) {
        if (!isNumber(min)) {
          throw new TypeError('Expected a number')
        }

        if (min < 0) {
          throw new RangeError('Expected a positive number')
        }

        minValue = duration(minOrUnit as DurationUnit, min)

        if (!isNumber(max)) {
          throw new TypeError('Expected a number')
        }

        if (max < 0) {
          throw new RangeError('Expected a positive number')
        }

        maxValue = duration(minOrUnit as DurationUnit, max)
      } else {
        minValue = duration(minOrUnit)

        if (min === undefined) {
          throw new TypeError('Expected a second duration')
        }

        maxValue = duration(min)
      }

      const current = self[this.name] as number | false

      if (current === false) {
        return self.with(this.name, minValue)
      }

      return self.with(
        this.name,
        Math.min(Math.max(current, minValue), maxValue),
      )
    }.bind(this),
  )
  readonly offset: {
    <Self extends Bag>(self: Self, value: Duration): Self
    <Self extends Bag>(self: Self, unit: DurationUnit, value: number): Self
    <Self extends Bag>(value: Duration): (self: Self) => Self
    <Self extends Bag>(unit: DurationUnit, value: number): (self: Self) => Self
  } = dual(
    (args) => args[0] instanceof DirectiveBag,
    function <Self extends Bag>(
      this: DurationDirective<Self>,
      self: Self,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) {
      let offset: number

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        offset = duration(valueOrUnit as DurationUnit, value, true)
      } else {
        offset = duration(valueOrUnit, true)
      }

      const current = self[this.name] as number | false

      if (current === false) {
        return self.with(this.name, offset)
      }

      return self.with(this.name, Math.max(current + offset, 0))
    }.bind(this),
  )
  readonly scale: {
    <Self extends Bag>(self: Self, value: number): Self
    <Self extends Bag>(self: Self, unit: DurationUnit, value: number): Self
    <Self extends Bag>(value: number): (self: Self) => Self
    <Self extends Bag>(unit: DurationUnit, value: number): (self: Self) => Self
  } = dual(
    (args) => args[0] instanceof DirectiveBag,
    function <Self extends Bag>(
      this: DurationDirective<Self>,
      self: Self,
      valueOrUnit: number | DurationUnit,
      value?: number,
    ) {
      let scale: number

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        scale = duration(valueOrUnit as DurationUnit, value, true)
      } else {
        scale = duration(valueOrUnit, true)
      }

      const current = self[this.name] as number | false

      if (current === false) {
        return self.with(this.name, scale)
      }

      return self.with(this.name, Math.max(current * scale, 0))
    }.bind(this),
  )

  constructor(private readonly name: KeysOfType<Bag, Duration | false>) {}
}
