export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">QAPT Platform</h1>
          <p className="text-sm text-muted-foreground">Property Management System</p>
        </div>
        {children}
      </div>
    </div>
  )
}
