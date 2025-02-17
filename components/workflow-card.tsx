"use client";

import * as React from "react";
import {ChevronRight, CheckCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";

export function WorkflowCard({
  id,
  card_title,
 card_description,
 button_text,
 badges,
}: {
 id: string;
 card_title: string;
 card_description: string;
 button_text: string;
 badges: string[];
}) {

  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/${id}`);
  };
  
 return (
  <Card className="flex flex-col h-full w-[400px]">
   <CardHeader className="text-center space-y-2.5">
    <CardTitle className="text-xl">{card_title}</CardTitle>
    <CardDescription className="text-sm">{card_description}</CardDescription>
   </CardHeader>
   <CardContent className="flex-1">
    <div className="flex flex-wrap gap-2">
     {badges.map((badge, index) => (
      <Badge key={index} variant="secondary" className="flex items-center gap-1">
       <CheckCircle className="h-3.5 w-3.5" />
       {badge}
      </Badge>
     ))}
    </div>
   </CardContent>
   <CardFooter>
        <Button className="w-full center" onClick={handleClick}>
          <span>{button_text}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
  </Card>
 );
}
