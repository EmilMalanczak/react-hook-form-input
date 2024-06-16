export class Adapter {
  private static value: unknown;

  static from<Source>(originalData: Source) {
    this.value = originalData;

    return this;
  }

  static to<Input, Output>(mapper: (data: Input) => Output) {
    return mapper(this.value as Input);
  }
}
