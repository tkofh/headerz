// import type { Header } from '../header'
// import { dual } from '../utils/function'
// import { isArray } from '../utils/predicates'
// import type { KeysOfType } from '../utils/types'
//
// export class ListDirective<
//   Value extends string,
//   Bag extends Header<Record<string, ReadonlyArray<Value> | false>>,
// > {
//   readonly set: {
//     <Self extends Bag>(self: Self, value: ReadonlyArray<string>): Self
//     <Self extends Bag>(value: ReadonlyArray<string>): (self: Self) => Self
//   } = dual(
//     2,
//     function <Self extends Bag>(
//       this: ListDirective<Value, Self>,
//       self: Self,
//       value: ReadonlyArray<Value>,
//     ) {
//       if (value.length === 0) {
//         return this.unset(self)
//       }
//       return self.with(this.name, value)
//     }.bind(this),
//   )
//
//   readonly include: {
//     <Self extends Bag>(self: Self, value: Value): Self
//     <Self extends Bag>(value: Value): (self: Self) => Self
//   } = dual(
//     2,
//     function <Self extends Bag>(
//       this: ListDirective<Value, Self>,
//       self: Self,
//       value: Value,
//     ) {
//       const current = self[this.name]
//
//       if (!isArray<Value>(current)) {
//         return self.with(this.name, [value])
//       }
//
//       if (current.includes(value)) {
//         return self
//       }
//
//       return self.with(this.name, [...current, value])
//     }.bind(this),
//   )
//
//   readonly exclude: {
//     <Self extends Bag>(self: Self, value: Value): Self
//     <Self extends Bag>(value: Value): (self: Self) => Self
//   } = dual(
//     2,
//     function <Self extends Bag>(
//       this: ListDirective<Value, Self>,
//       self: Self,
//       value: Value,
//     ) {
//       const current = self[this.name]
//
//       if (!isArray<Value>(current)) {
//         return self
//       }
//
//       if (!current.includes(value)) {
//         return self
//       }
//
//       return self.with(
//         this.name,
//         current.filter((v) => v !== value),
//       )
//     }.bind(this),
//   )
//
//   constructor(
//     private readonly name: KeysOfType<Bag, ReadonlyArray<Value> | false>,
//   ) {}
//
//   unset<Self extends Bag>(self: Self): Self {
//     return self.with(this.name, false)
//   }
// }
