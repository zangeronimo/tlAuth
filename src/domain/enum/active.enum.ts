export enum ActiveEnum {
  INACTIVE = 0,
  ACTIVE = 1,
}

export function numberToActiveEnum(n: number) {
  if (n) return ActiveEnum.ACTIVE
  return ActiveEnum.INACTIVE
}

