"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DoorClosed, Loader2 } from "lucide-react"

import { getRooms, type OperatingRoom } from "@/api/rooms"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"


export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [rooms, setRooms] = useState<OperatingRoom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getRooms()
        setRooms(data)
      } catch (err) {
        console.error("Failed to fetch rooms:", err)
        setIsUsingFallback(true)
        toast({
          title: "Using backup data",
          description: "Could not connect to the server. Showing sample data instead.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadRooms()
  }, [toast])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-900">Operating Rooms</h1>
          <div className="flex items-center gap-2">
            <p className="text-blue-600">Select an operating room to begin</p>
            {isUsingFallback && (
              <span className="px-2 py-1 rounded-full bg-red-100 text-white-700 text-xs font-medium">
                Failed to fetch from the database - consult the administrator
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-blue-600">Loading operating rooms...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="border-blue-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/dashboard/room/${room.id}`)}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                    <DoorClosed className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-900">{room.name}</CardTitle>
                  <CardDescription>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.status}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full ${
                      room.status === "Available" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (room.status === "Available") {
                        router.push(`/dashboard/room/${room.id}`)
                      }
                    }}
                    disabled={room.status !== "Available"}
                  >
                    {room.status === "Available" ? "Enter Room" : "Room Occupied"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
