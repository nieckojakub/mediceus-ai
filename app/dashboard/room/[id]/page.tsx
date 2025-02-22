"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import VoiceComponent from "@/components/VoiceComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mic, MicOff, Download, Pencil } from "lucide-react"

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("surgery")
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [surgeryDetails, setSurgeryDetails] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    procedure: "",
  })

  const handleSubmitSurgeryDetails = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    setSurgeryDetails({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      patientId: formData.get("patientId") as string,
      procedure: formData.get("procedure") as string,
    })
    setFormSubmitted(true)
    setActiveTab("transcription")
  }

  const downloadReport = () => {
    console.log("Downloading report...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Button>
          <h1 className="text-2xl font-bold text-blue-900">Operating Room {params.id}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-blue-50">
            <TabsTrigger
              value="surgery"
              className="data-[state=active]:bg-white"
              disabled={formSubmitted && isRecording}
            >
              Surgery Details
            </TabsTrigger>
            <TabsTrigger value="transcription" className="data-[state=active]:bg-white" disabled={!formSubmitted}>
              Live Transcription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surgery">
            <Card className="border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900">Patient Information</CardTitle>
                <CardDescription className="text-blue-600">Enter patient and surgery details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSurgeryDetails} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        className="border-blue-100"
                        required
                        defaultValue={surgeryDetails.firstName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        className="border-blue-100"
                        required
                        defaultValue={surgeryDetails.lastName}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId" className="text-gray-700">
                      Patient ID
                    </Label>
                    <Input
                      id="patientId"
                      name="patientId"
                      className="border-blue-100"
                      required
                      defaultValue={surgeryDetails.patientId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="procedure" className="text-gray-700">
                      Procedure
                    </Label>
                    <Input
                      id="procedure"
                      name="procedure"
                      className="border-blue-100"
                      required
                      defaultValue={surgeryDetails.procedure}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {formSubmitted ? "Update Surgery Details" : "Start Surgery"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcription">
            <Card className="border-blue-100 shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-blue-900">Live Transcription</CardTitle>
                    <CardDescription className="text-blue-600">Voice-assisted documentation</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => setActiveTab("surgery")}
                    disabled={isRecording}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Surgery Details Summary */}
                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Patient:</span>{" "}
                      <span className="text-gray-700">
                        {surgeryDetails.firstName} {surgeryDetails.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ID:</span>{" "}
                      <span className="text-gray-700">{surgeryDetails.patientId}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Procedure:</span>{" "}
                      <span className="text-gray-700">{surgeryDetails.procedure}</span>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] rounded-lg border border-blue-100 bg-white p-4 overflow-y-auto">
                  {transcript.map((line, index) => (
                    <p key={index} className="text-sm text-gray-600 py-1">
                      {new Date().toLocaleTimeString()} - {line}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2">
                  <VoiceComponent />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
