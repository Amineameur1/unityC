export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading department data...</p>
      </div>
    </div>
  )
}
