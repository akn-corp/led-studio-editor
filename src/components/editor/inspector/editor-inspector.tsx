function EditorInspector() {
  return (
    <div className="absolute top-16 right-4 bottom-4 z-10 flex w-72 flex-col gap-4 rounded-lg border border-border/50 bg-background/70 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <h2 className="text-sm font-semibold">Inspector</h2>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        Select an element to edit its properties
      </div>
    </div>
  )
}

export { EditorInspector }
