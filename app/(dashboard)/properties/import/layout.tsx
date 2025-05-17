"use client"

import { ReactNode, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImportWizardLayoutProps {
  children: ReactNode
}

export default function ImportWizardLayout({ children }: ImportWizardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname.includes("/template")) return 1
    if (pathname.includes("/upload")) return 2
    if (pathname.includes("/mapping")) return 3
    if (pathname.includes("/validation")) return 4
    return 1
  }

  const [currentStep, setCurrentStep] = useState<number>(1)

  useEffect(() => {
    setCurrentStep(getCurrentStep())
  }, [pathname])

  const steps = [
    { name: "Template", path: "/properties/import/template" },
    { name: "Upload", path: "/properties/import/upload" },
    { name: "Mapping", path: "/properties/import/mapping" },
    { name: "Validation", path: "/properties/import/validation" }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with back button */}
      <div className="border-b">
        <div className="container py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/properties")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-center">
            <div className="max-w-xl w-full flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  {/* Step dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center border-2",
                        index + 1 <= currentStep
                          ? "bg-[#285755] border-[#285755] text-white"
                          : "border-gray-300 text-gray-300"
                      )}
                    >
                      {index + 1 < currentStep ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium",
                        index + 1 <= currentStep ? "text-[#285755]" : "text-gray-400"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-[2px] flex-1 mx-2",
                        index + 1 < currentStep
                          ? "bg-[#285755]"
                          : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container py-8 flex justify-center">
        {children}
      </div>
    </div>
  )
}
