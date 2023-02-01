declare interface Array<T> {
  clearMap<U>(callbackfn: (value: T, index?: number, array?: T[]) => U): U[];
}
