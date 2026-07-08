function EditorInspector() {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-4 border-l border-border bg-background px-4 pt-18 pb-4">
      <h2 className="text-sm font-semibold">Inspector</h2>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        Select an element to edit its properties
      </div>
    </div>
  )
}

export { EditorInspector }
