"use client";

import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Check, X, Loader2, FileSpreadsheet, ExternalLink} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {GmailIcon, GSheetsIcon} from "@/components/icons";

function JobApplicationWorkflow() {
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
     initializeGoogleClient();
    }
   };
  };

  loadGoogleScript();
 }, []);

 const initializeGoogleClient = () => {
  window.google.accounts.oauth2.initTokenClient({
   client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
   scope: `
      https://www.googleapis.com/auth/gmail.send
      https://www.googleapis.com/auth/gmail.readonly
      https://www.googleapis.com/auth/gmail.modify
      https://www.googleapis.com/auth/gmail.compose
      https://www.googleapis.com/auth/gmail.metadata
      https://www.googleapis.com/auth/gmail.insert
      https://www.googleapis.com/auth/gmail.settings.basic
      https://www.googleapis.com/auth/gmail.settings.sharing
      https://www.googleapis.com/auth/gmail.addons.current.action.compose
      https://www.googleapis.com/auth/gmail.addons.current.message.action
      https://www.googleapis.com/auth/gmail.labels
      https://www.googleapis.com/auth/userinfo.email
      https://www.googleapis.com/auth/userinfo.profile
      openid
      https://www.googleapis.com/auth/gmail.addons.current.message.metadata
      https://www.googleapis.com/auth/gmail.addons.current.message.readonly
    `
    .replace(/\s+/g, " ")
    .trim(),
   callback: handleGoogleCallback,
  });
 };

 const handleGoogleCallback = async (response: any) => {
  console.log("Full Google Response:", response); // Log the initial response

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
    console.log("Gmail Profile Data:", profileData); // Log Gmail profile data

    // Create auth data object
    const authData = {
     ...response,
     email: profileData.emailAddress,
     timestamp: new Date().getTime(),
    };

    console.log("Final Auth Data:", authData); // Log final auth data

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
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: `
        https://www.googleapis.com/auth/gmail.send
        https://www.googleapis.com/auth/gmail.readonly
        https://www.googleapis.com/auth/gmail.modify
        https://www.googleapis.com/auth/gmail.compose
        https://www.googleapis.com/auth/gmail.metadata
        https://www.googleapis.com/auth/gmail.insert
        https://www.googleapis.com/auth/gmail.settings.basic
        https://www.googleapis.com/auth/gmail.settings.sharing
        https://www.googleapis.com/auth/gmail.addons.current.action.compose
        https://www.googleapis.com/auth/gmail.addons.current.message.action
        https://www.googleapis.com/auth/gmail.labels
        https://www.googleapis.com/auth/userinfo.email
        https://www.googleapis.com/auth/userinfo.profile
        openid
        https://www.googleapis.com/auth/gmail.addons.current.message.metadata
        https://www.googleapis.com/auth/gmail.addons.current.message.readonly
      `
     .replace(/\s+/g, " ")
     .trim(),
    callback: handleGoogleCallback,
   });

   tokenClient.requestAccessToken();
  }
 };

 // Validate Google Drive link
 const validateDriveLink = (link: string) => {
  const drivePattern = /^https:\/\/drive\.google\.com\/file\/d\//;
  return drivePattern.test(link) || link === "";
 };

 // Validate Google Sheets link
 const validateSheetLink = (link: string) => {
  const sheetPattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\//;
  return sheetPattern.test(link) || link === "";
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
  <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-8">
   <div className="space-y-4 text-center mb-12">
    <Badge variant="secondary" className="mb-4 rounded-full">
     Automation Tool
    </Badge>
    <h1 className="text-4xl font-bold mb-2">Job Application Automation</h1>
    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
     Streamline your job application process with automated responses and
     tracking
    </p>
   </div>

   <div className="space-y-6">
    <Card className="service-card">
     <div className="card-gradient" />
     <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
       <div>
        <h2 className="text-lg font-semibold mb-1">Gmail Connection</h2>
        <p className="helper-text">
         {isGmailConnected
          ? "Click to disconnect your account"
          : "Connect your Gmail account to start automation"}
        </p>
       </div>
       <Button
        variant={isGmailConnected ? "outline" : "default"}
        onClick={handleGmailConnect}
        className="connection-button"
       >
        <GmailIcon />
        {isGmailConnected ? "Connected" : "Connect Gmail"}
       </Button>
      </div>

      {isGmailConnected && googleAuth?.email && (
       <div className="status-indicator text-success scale-in">
        <Check className="w-4 h-4" />
        <span className="font-bold">{googleAuth.email}</span>
       </div>
      )}
     </div>
    </Card>

    <Card className="service-card">
     <div className="card-gradient" />
     <div className="relative z-10">
      <h2 className="text-lg font-semibold mb-4">Document Links</h2>

      <div className="space-y-6">
       {/* Resume Link Input */}
       <div>
        <label className="text-sm font-medium mb-1.5 block">
         Resume Link (Google Drive)
        </label>
        <div className="relative">
         <Input
          value={resumeLink}
          onChange={(e) => setResumeLink(e.target.value)}
          className={`input-transition ${
           resumeLink && !validateDriveLink(resumeLink)
            ? "border-destructive"
            : resumeLink
            ? "border-success"
            : ""
          }`}
          placeholder="Paste your Google Drive resume link"
         />
         {resumeLink && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
           {validateDriveLink(resumeLink) ? (
            <Check className="w-4 h-4 text-success" />
           ) : (
            <X className="w-4 h-4 text-destructive" />
           )}
          </div>
         )}
        </div>
        {resumeLink && !validateDriveLink(resumeLink) && (
         <p className="text-sm text-destructive mt-1">
          Please enter a valid Google Drive link
         </p>
        )}
       </div>

       {/* Sheet Link Input */}
       <div>
        <div className="flex items-center justify-between mb-1.5">
         <label className="text-sm font-medium mb-1.5 block">
          Application Tracking Sheet
         </label>
         <button onClick={handleGetTemplate} className="template-button">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Get Template</span>
          <ExternalLink className="w-3 h-3" />
         </button>
        </div>
        <div className="relative">
         <Input
          value={sheetLink}
          onChange={(e) => setSheetLink(e.target.value)}
          className={`input-transition ${
           sheetLink && !validateSheetLink(sheetLink)
            ? "border-destructive"
            : sheetLink
            ? "border-success"
            : ""
          }`}
          placeholder="Paste your Google Sheets tracking link"
         />
         {sheetLink && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
           {validateSheetLink(sheetLink) ? (
            <Check className="w-4 h-4 text-success" />
           ) : (
            <X className="w-4 h-4 text-destructive" />
           )}
          </div>
         )}
        </div>
        {sheetLink && !validateSheetLink(sheetLink) && (
         <p className="text-sm text-destructive mt-1">
          Please enter a valid Google Sheets link
         </p>
        )}
       </div>
      </div>
     </div>
    </Card>

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

declare global {
 interface Window {
  google: {
   accounts: {
    oauth2: {
     initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: any) => void;
     }) => {
      requestAccessToken: () => void;
     };
    };
   };
  };
 }
}

export default JobApplicationWorkflow;
