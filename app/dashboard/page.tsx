"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorClosed } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const operatingRooms = [
    { id: 1, name: "Operating Room 1", status: "Available" },
    { id: 2, name: "Operating Room 2", status: "Available" },
    { id: 3, name: "Operating Room 3", status: "Available" },
    { id: 4, name: "Operating Room 4", status: "Available" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-900">Operating Rooms</h1>
          <p className="text-blue-600">Select an operating room to begin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {operatingRooms.map((room) => (
            <Card
              key={room.id}
              className="border-blue-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/room/${room.id}`)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <DoorClosed className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">{room.name}</CardTitle>
                <CardDescription className="text-blue-600">{room.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push(`/dashboard/room/${room.id}`)}
                >
                  Enter Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

