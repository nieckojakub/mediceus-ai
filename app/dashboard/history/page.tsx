"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app this would come from an API
const surgeryHistory = [
  {
    id: 1,
    date: "2025-02-23",
    startTime: "14:30",
    endTime: "15:30",
    room: "Operating Room 1",
    patient: "Jan Kowalski",
    doctor: "Mateusz Kowal",
    procedure: "Appendectomy",
    duration: "1h",
    notes: "Successful procedure with no complications",
    status: "Completed",
  },
  {
    id: 2,
    date: "2025-02-23",
    startTime: "11:00",
    endTime: "13:15",
    room: "Operating Room 3",
    patient: "Jane Smith",
    doctor: "Michael Brown",
    procedure: "Knee Arthroscopy",
    duration: "2h 15min",
    notes: "Patient responded well to anesthesia",
    status: "Completed",
  },
]

const operatingRooms = ["All Rooms", "Operating Room 1", "Operating Room 2", "Operating Room 3", "Operating Room 4"]

const doctors = ["All Doctors", "Mateusz Kowal", "Dr. Michael Brown", "Dr. Emily Jones", "Dr. David Wilson"]

export default function HistoryPage() {
  const [selectedRoom, setSelectedRoom] = useState("All Rooms")
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors")
  const [date, setDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = surgeryHistory.filter((surgery) => {
    const matchesRoom = selectedRoom === "All Rooms" || surgery.room === selectedRoom
    const matchesDoctor = selectedDoctor === "All Doctors" || surgery.doctor === selectedDoctor
    const matchesDate = !date || surgery.date === format(date, "yyyy-MM-dd")
    const matchesSearch =
      searchQuery === "" ||
      surgery.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surgery.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surgery.notes.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRoom && matchesDoctor && matchesDate && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-900">Surgery Reports</h1>
            <p className="text-blue-600">View and download detailed surgery reports</p>
          </div>
        </div>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Filters</CardTitle>
            <CardDescription className="text-blue-600">Refine the surgery reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8 border-blue-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="border-blue-100">
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  {operatingRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="border-blue-100">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="border-blue-100 text-left font-normal">
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((surgery) => (
                  <TableRow key={surgery.id}>
                    <TableCell className="font-medium">
                      <div>{surgery.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {surgery.startTime} - {surgery.endTime}
                      </div>
                    </TableCell>
                    <TableCell>{surgery.patient}</TableCell>
                    <TableCell>{surgery.procedure}</TableCell>
                    <TableCell>{surgery.doctor}</TableCell>
                    <TableCell>{surgery.room}</TableCell>
                    <TableCell>{surgery.duration}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {surgery.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

