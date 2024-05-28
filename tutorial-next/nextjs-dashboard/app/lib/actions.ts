'use server';

import { z } from 'zod'; // 型検証に用いるライブラリ

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    const amountInCents = amount * 100; // 金額の単位をセントにする
    const date = new Date().toISOString().split('T')[0]; // 日付データの形式を[YYYY-MM-DD]で作成
}