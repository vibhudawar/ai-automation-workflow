"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { GmailIcon } from "@/components/icons";

interface GmailConnectionProps {
  isConnected: boolean;
  email: string | null;
  onConnect: () => void;
}

export function GmailConnection({ isConnected, email, onConnect }: GmailConnectionProps) {
  return (
    <Card className="service-card">
      <div className="card-gradient" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Gmail Connection</h2>
            <p className="helper-text">
              {isConnected
                ? "Click to disconnect your account"
                : "Connect your Gmail account to start automation"}
            </p>
          </div>
          <Button
            variant={isConnected ? "outline" : "default"}
            onClick={onConnect}
            className="connection-button"
          >
            <GmailIcon />
            {isConnected ? "Connected" : "Connect Gmail"}
          </Button>
        </div>

        {isConnected && email && (
          <div className="status-indicator text-success scale-in">
            <Check className="w-4 h-4" />
            <span>{email}</span>
          </div>
        )}
      </div>
    </Card>
  );
}