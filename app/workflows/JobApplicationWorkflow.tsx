"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Loader2} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {GmailConnection} from "../components/gmail-connection";
import {DocumentLinks} from "../components/document-links";
import { validateDriveLink, validateSheetLink } from "@/app/lib/validators";
import { initializeGoogleClient, GMAIL_SCOPES } from "@/app/lib/google-auth";

export default function JobApplicationWorkflow() {
 const [isGmailConnected, setIsGmailConnected] = useState(false);
 const [isRunning, setIsRunning] = useState(false);
 const [resumeLink, setResumeLink] = useState("");
 const [sheetLink, setSheetLink] = useState("");
 const [googleAuth, setGoogleAuth] = useState<any>(null);
 const {toast} = useToast();

 useEffect(() => {
  // Check for existing auth data in localStorage
  const savedAuth = localStorage.getItem("googleAuth");
  if (savedAuth) {
   const authData = JSON.parse(savedAuth);
   setGoogleAuth(authData);
   setIsGmailConnected(true);
  }

  // Load Google Identity Services script
  const loadGoogleScript = () => {
   const script = document.createElement("script");
   script.src = "https://accounts.google.com/gsi/client";
   script.async = true;
   script.defer = true;
   document.head.appendChild(script);

   script.onload = () => {
    if (window.google) {
      initializeGoogleClient(handleGoogleCallback);
    }
   };
  };

  loadGoogleScript();
 }, []);

 const handleGoogleCallback = async (response: any) => {
  if (response.access_token) {
   try {
    // First verify the token with your backend
    const tokenValidation = await fetch("/api/auth/google", {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({token: response.access_token}),
    });

    console.log(
     "Token Validation Response:",
     await tokenValidation.clone().json()
    ); // Log token validation

    if (!tokenValidation.ok) {
     throw new Error("Failed to validate token");
    }

    // If token is valid, fetch user's Gmail profile
    const userProfile = await fetch(
     "https://www.googleapis.com/gmail/v1/users/me/profile",
     {
      headers: {
       Authorization: `Bearer ${response.access_token}`,
      },
     }
    );

    const profileData = await userProfile.json();

    // Create auth data object
    const authData = {
     ...response,
     email: profileData.emailAddress,
     timestamp: new Date().getTime(),
    };

    // Save to state and localStorage
    setGoogleAuth(authData);
    localStorage.setItem("googleAuth", JSON.stringify(authData));
    setIsGmailConnected(true);
   } catch (error) {
    console.error("Error in Google Authentication:", error); // Log any errors
    setIsGmailConnected(false);
    localStorage.removeItem("googleAuth");
   }
  }
  toast({
   title: "Connected",
   description: "Gmail account has been connected successfully",
  });
 };

 const handleGmailConnect = () => {
  if (isGmailConnected) {
   // Disconnect functionality
   setIsGmailConnected(false);
   setGoogleAuth(null);
   localStorage.removeItem("googleAuth");
  } else if (window.google) {
   // Connect functionality
   const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    scope: GMAIL_SCOPES.replace(/\s+/g, " ").trim(),
    callback: handleGoogleCallback,
   });

   tokenClient.requestAccessToken();
  }
 };

 const handleGetTemplate = () => {
  const templateUrl = "YOUR_TEMPLATE_SHEET_URL";
  window.open(templateUrl, "_blank");
  toast({
   title: "Opening Template",
   description: "Redirecting to Google Sheets template...",
  });
 };

 const handleRunWorkflow = async () => {
  setIsRunning(true);
  toast({
   title: "Workflow Started",
   description: "Processing your job applications...",
  });
  try {
   const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     token: googleAuth.access_token,
     email: googleAuth.email,
     resumeLink,
     sheetLink,
    }),
   });

   if (!response.ok) {
    throw new Error("Workflow failed");
   }

   const data = await response.json();
   console.log("Workflow response:", data);

   toast({
    title: "Success",
    description: "Workflow completed successfully",
   });
  } catch (error) {
   console.error("Error running workflow:", error);
   toast({
    title: "Error",
    description: "Failed to run workflow",
    variant: "destructive",
   });
  } finally {
   setIsRunning(false);
  }
 };

 return (
  <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-8 fade-in">
    <div className="space-y-4 text-center mb-12">
      <Badge variant="secondary" className="mb-4 fancy-badge rounded-full">
        Automation Tool
      </Badge>
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
        Job Application Automation
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl mx-auto">
        Streamline your job application process with automated responses and tracking
      </p>
    </div>

    <div className="space-y-6">
      <GmailConnection 
        isConnected={isGmailConnected}
        email={googleAuth?.email}
        onConnect={handleGmailConnect}
      />

      <DocumentLinks
        resumeLink={resumeLink}
        sheetLink={sheetLink}
        onResumeChange={setResumeLink}
        onSheetChange={setSheetLink}
        onGetTemplate={handleGetTemplate}
      />

      <Button
        className="w-full h-12 text-lg font-medium"
        disabled={
          !isGmailConnected || 
          !validateDriveLink(resumeLink) || 
          !validateSheetLink(sheetLink) || 
          isRunning
        }
        onClick={handleRunWorkflow}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Applications...
          </>
        ) : (
          "Run Workflow"
        )}
      </Button>
    </div>
  </div>
);
}


