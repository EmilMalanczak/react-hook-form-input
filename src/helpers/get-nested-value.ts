type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? "0" extends keyof T
      ? undefined
      : number extends keyof T
        ? T[number]
        : undefined
    : undefined

type FieldWithPossiblyUndefined<T, Key> =
  | GFT<Exclude<T, undefined>, Key>
  | Extract<T, undefined>

type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>

type RR<Rest extends string, Right extends string> = Rest extends ""
  ? Right
  : `${Rest}.${Right}`

type FieldIndex<
  O,
  FieldKey extends string,
  Index extends string,
  Rest extends string
> = FieldKey extends keyof O
  ? FieldWithPossiblyUndefined<O[FieldKey], `[${Index}]${Rest}`>
  : undefined

type GFT<O, K> = K extends keyof O
  ? O[K]
  : K extends `${infer Left}.${infer Right}`
    ? Left extends keyof O
      ? FieldWithPossiblyUndefined<O[Left], Right>
      : Left extends `[${infer Index}]${infer Rest}`
        ? FieldWithPossiblyUndefined<
            IndexedFieldWithPossiblyUndefined<O, Index>,
            RR<Rest, Right>
          >
        : Left extends `${infer FieldKey}[${infer Index}]${infer Rest}`
          ? FieldIndex<O, FieldKey, Index, RR<Rest, Right>>
          : undefined
    : K extends `[${infer Index}]${infer Rest}`
      ? Index extends keyof O
        ? Rest extends ""
          ? IndexedFieldWithPossiblyUndefined<O, Index>
          : FieldWithPossiblyUndefined<
              IndexedFieldWithPossiblyUndefined<O, Index>,
              Rest
            >
        : undefined
      : K extends `${infer FieldKey}[${infer Index}]${infer Rest}`
        ? FieldIndex<O, FieldKey, Index, Rest>
        : undefined

export function getNestedValue<
  TData,
  TPath extends string,
  TDefault = GFT<TData, TPath>
>(
  data: TData,
  path: TPath,
  defaultValue?: TDefault
): GFT<TData, TPath> | TDefault {
  const value = path
    .split(/[.[\]]/)
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce<GFT<TData, TPath>>((val, key) => (val as any)?.[key], data as any)

  return value !== undefined ? value : (defaultValue as TDefault)
}
