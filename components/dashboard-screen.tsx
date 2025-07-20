import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardScreen() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your Dashboard!</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-muted/50 flex items-center justify-center text-sm text-muted-foreground"
              >
                Dashboard Widget {i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
