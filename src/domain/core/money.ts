export type IdrAmount = number & { readonly __idrAmount: unique symbol };

export function idr(value: number): IdrAmount {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`IDR amount must be a safe integer rupiah value: ${value}`);
  }

  return value as IdrAmount;
}

export function nonNegativeIdr(value: number): IdrAmount {
  const amount = idr(value);
  if (amount < 0) {
    throw new Error(`IDR amount must be non-negative: ${value}`);
  }

  return amount;
}

export function addIdr(...amounts: IdrAmount[]): IdrAmount {
  return idr(amounts.reduce((total, amount) => total + amount, 0));
}

export function multiplyIdr(rate: IdrAmount, quantity: number): IdrAmount {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error(`IDR quantity must be a non-negative integer: ${quantity}`);
  }

  return idr(rate * quantity);
}

export function formatIdr(amount: IdrAmount, locale = "id-ID"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
