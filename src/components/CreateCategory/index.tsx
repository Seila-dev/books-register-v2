'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createCategory(formData: FormData) {
  const name = formData.get('name')?.toString();

  if (!name || name.trim() === '') {
    return { error: 'Nome da categoria é obrigatório' };
  }

const cookieStore = await cookies()
  const token = cookieStore.get('books-register.token')?.value;

  const res = await fetch(`${process.env.API_URL}/categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    return { error: 'Erro ao criar categoria' };
  }

  // Revalida a rota atual
  revalidatePath('/books/create');

  return { success: true };
}