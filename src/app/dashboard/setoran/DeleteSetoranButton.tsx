"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSetoran } from "@/lib/actions/setoran";

export default function DeleteSetoranButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (confirm("Kirim data ini ke tong sampah?")) {
      startTransition(async () => {
        await deleteSetoran(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
