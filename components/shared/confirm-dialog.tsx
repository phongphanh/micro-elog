"use client"

import { Button } from "@/components/ui/button"

export type ConfirmState = {
  title: string
  body: string
  onConfirm: () => void
}

export function ConfirmDialog({ state, onClose }: { state: ConfirmState | null; onClose: () => void }) {
  if (!state) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-md rounded-lg border bg-background p-5 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-semibold">{state.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{state.body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => { state.onConfirm(); onClose() }}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}
