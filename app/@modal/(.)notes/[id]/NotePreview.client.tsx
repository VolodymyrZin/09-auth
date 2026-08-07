'use client';

import { useRouter } from 'next/navigation';

import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview id={id} />
    </Modal>
  );
}
