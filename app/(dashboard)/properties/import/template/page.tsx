"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TemplateStep() {
  const router = useRouter()
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownloadTemplate = () => {
    // Download the template file
    const link = document.createElement("a")
    link.href = "/assets/properties_template.xlsx"
    link.download = "properties_import_template.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Mark as downloaded
    setIsDownloaded(true)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-xl w-full flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2">Before you start</h1>
        <p className="text-gray-600 mb-8">
          Your data must be in a specific format for the import to work correctly.
          Download our template file to ensure your data is properly formatted.
        </p>

        <Card className="mb-8 w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FileDown className="h-8 w-8 text-[#285755]" />
              </div>
              <h3 className="text-xl font-medium mb-2">Download the template</h3>
              <p className="text-gray-500 mb-4">
                Use this Excel template to prepare your property data for import.
              </p>
              <Button
                onClick={handleDownloadTemplate}
                className="gap-2 bg-[#285755] hover:bg-[#285755]/90"
              >
                <FileDown className="h-4 w-4" />
                Download an example
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => router.push("/properties/import/upload")}
          className="gap-2 bg-[#285755] hover:bg-[#285755]/90 px-8"
        >
          I'm ready to import
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
