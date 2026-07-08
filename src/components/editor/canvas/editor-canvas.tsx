function EditorCanvas() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-auto bg-muted/30 p-8">
      <div className="flex aspect-video w-full max-w-3xl items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        Canvas — LED environment preview
      </div>
    </div>
  )
}

export { EditorCanvas }
