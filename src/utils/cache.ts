export class Cached<T> {
  private data: T;

  dataGetter: () => T;

  updateCondition: () => boolean;

  constructor(dataGetter: () => T, updateCondition: () => boolean, initialData?: T) {
    this.dataGetter = dataGetter;
    this.updateCondition = updateCondition;
    this.data = initialData ?? this.dataGetter();
  }

  getData(): T {
    if (this.updateCondition()) {
      this.data = this.dataGetter();
    }

    return this.data;
  }
}
