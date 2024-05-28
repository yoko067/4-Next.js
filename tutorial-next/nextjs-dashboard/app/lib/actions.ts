'use server';

import { z } from 'zod'; // 型検証に用いるライブラリ
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; // キャッシュをクリアし、サーバーへの新しい要求をする関数
import { redirect } from 'next/navigation'; // リダイレクトを行う関数
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
      const amountInCents = amount * 100; // 金額の単位をセントにする
      const date = new Date().toISOString().split('T')[0]; // 日付データの形式を[YYYY-MM-DD]で作成
    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
  revalidatePath('/dashboard/invoices'); // キャッシュの削除
  redirect('/dashboard/invoices'); // 請求書一覧のページにリダイレクト

}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch{
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}