export interface IFactValue<TValue> {
  factProviderAddress: string;
  passportAddress: string;
  key: string;
  value: TValue;
}
