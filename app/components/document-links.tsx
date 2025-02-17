"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, X, FileSpreadsheet, ExternalLink } from "lucide-react";
import { validateDriveLink, validateSheetLink } from "@/app/lib/validators";

interface DocumentLinksProps {
  resumeLink: string;
  sheetLink: string;
  onResumeChange: (value: string) => void;
  onSheetChange: (value: string) => void;
  onGetTemplate: () => void;
}

export function DocumentLinks({
  resumeLink,
  sheetLink,
  onResumeChange,
  onSheetChange,
  onGetTemplate,
}: DocumentLinksProps) {
  return (
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
                onChange={(e) => onResumeChange(e.target.value)}
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
              <label className="text-sm font-medium">
                Application Tracking Sheet
              </label>
              <button
                onClick={onGetTemplate}
                className="template-button"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Get Template</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="relative">
              <Input
                value={sheetLink}
                onChange={(e) => onSheetChange(e.target.value)}
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
  );
}