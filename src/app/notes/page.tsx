// app/notes/page.tsx

import NotesClient from './NotesClient';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 w-full mx-auto">
      <NotesClient />
    </div>
  );
}
