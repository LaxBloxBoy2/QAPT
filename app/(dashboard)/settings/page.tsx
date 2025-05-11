import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="john@example.com"
                  />
                </div>
              </div>
              <Button className="mt-2 w-fit">Update Profile</Button>
            </div>
            
            <Separator />
            
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Password</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium" htmlFor="current-password">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <Button className="mt-2 w-fit">Change Password</Button>
            </div>
            
            <Separator />
            
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="email-notifications" className="text-sm font-medium">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="sms-notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="sms-notifications" className="text-sm font-medium">
                    SMS Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="app-notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="app-notifications" className="text-sm font-medium">
                    In-App Notifications
                  </label>
                </div>
              </div>
              <Button className="mt-2 w-fit">Save Preferences</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
