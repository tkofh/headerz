import type { Duration } from '../duration'
import { dual } from '../utils/function'
import type { KeysOfType } from '../utils/types'
import type { DirectiveBag } from './bag'

export class BooleanDirective<
  Bag extends DirectiveBag<Record<string, boolean | Duration>>,
> {
  readonly set: {
    <Self extends Bag>(self: Self, value: boolean): Self
    <Self extends Bag>(value: boolean): (self: Self) => Self
  } = dual(
    2,
    function <Self extends Bag>(
      this: BooleanDirective<Self>,
      self: Self,
      value: boolean,
    ) {
      return self.with(this.name, value)
    }.bind(this),
  )
  readonly or: {
    <Self extends Bag>(self: Self, value: boolean): Self
    <Self extends Bag>(value: boolean): (self: Self) => Self
  } = dual(
    2,
    function <Self extends Bag>(
      this: BooleanDirective<Self>,
      self: Self,
      value: boolean,
    ) {
      return self.with(this.name, !!self[this.name] || value)
    }.bind(this),
  )
  readonly and: {
    <Self extends Bag>(self: Self, value: boolean): Self
    <Self extends Bag>(value: boolean): (self: Self) => Self
  } = dual(
    2,
    function <Self extends Bag>(
      this: BooleanDirective<Self>,
      self: Self,
      value: boolean,
    ) {
      return self.with(this.name, !!self[this.name] && value)
    }.bind(this),
  )
  readonly xor: {
    <Self extends Bag>(self: Self, value: boolean): Self
    <Self extends Bag>(value: boolean): (self: Self) => Self
  } = dual(
    2,
    function <Self extends Bag>(
      this: BooleanDirective<Self>,
      self: Self,
      value: boolean,
    ) {
      return self.with(this.name, !!self[this.name] !== value)
    }.bind(this),
  )

  constructor(private readonly name: KeysOfType<Bag, boolean>) {}

  negate<Self extends Bag>(self: Self): Self {
    if (self[this.name] === undefined) {
      return self
    }
    return self.with(this.name, !self[this.name])
  }
}
