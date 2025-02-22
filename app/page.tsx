import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full border-blue-100 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-blue-50 w-fit">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-900">Medicus</CardTitle>
          <CardDescription className="text-blue-600">AI-Powered Surgical Assistant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-gray-600">Streamline surgical documentation with AI-powered voice assistance.</p>
            <p className="text-sm text-gray-500">Real-time transcription • Voice commands • Instant reports</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Login to Continue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

