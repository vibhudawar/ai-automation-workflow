import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import './globals.css'
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <div className="flex min-h-screen items-center justify-center">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
              <Toaster />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}