export class Cached<T> {
  private data: T;

  dataGetter: () => T;

  updateCondition: () => boolean;

  constructor(dataGetter: () => T, updateCondition: () => boolean, initialData?: T) {
    this.dataGetter = dataGetter;
    this.updateCondition = updateCondition;
    this.data = initialData ?? this.dataGetter();
  }

  static tiedToObject<R, S extends object>(dataGetter: () => R, target: S, initialData?: R) {
    // creates a Cached that updates when a property of the target object changes
    let shouldUpdate = false;

    const proxy = new Proxy(target, {
      set(...args) {
        shouldUpdate = true;
        return Reflect.set(...args);
      },
    });

    const cached = new Cached<R>(() => {
      shouldUpdate = false;
      return dataGetter();
    }, () => shouldUpdate, initialData);

    return { cached, proxy };
  }

  getData(): T {
    if (this.updateCondition()) {
      this.data = this.dataGetter();
    }

    return this.data;
  }
}
