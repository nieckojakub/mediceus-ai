import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function HistoryPage() {
  const surgeryHistory = [
    {
      id: 1,
      date: "2024-02-22",
      room: "Operating Room 1",
      patient: "John Doe",
      procedure: "Appendectomy",
      duration: "1h 30min",
    },
    {
      id: 2,
      date: "2024-02-21",
      room: "Operating Room 3",
      patient: "Jane Smith",
      procedure: "Knee Arthroscopy",
      duration: "2h 15min",
    },
    {
      id: 3,
      date: "2024-02-20",
      room: "Operating Room 2",
      patient: "Mike Johnson",
      procedure: "Hernia Repair",
      duration: "45min",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-900">Surgery History</h1>
          <p className="text-blue-600">View and download past surgery reports</p>
        </div>

        <div className="grid gap-4">
          {surgeryHistory.map((surgery) => (
            <Card key={surgery.id} className="border-blue-100 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-blue-900">{surgery.procedure}</CardTitle>
                    <CardDescription className="text-blue-600">
                      {surgery.date} • {surgery.room}
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="border-t border-blue-100 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Patient:</span>{" "}
                    <span className="text-gray-700">{surgery.patient}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>{" "}
                    <span className="text-gray-700">{surgery.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

