"use client";

import type { Integration } from "@/lib/integrations";
import type { Component } from "../component";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import type { ReactElement } from "react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

type IntegrationCardProps = {
  integration: Integration;

  showConfigureButton?: boolean;
  actionButton?: ReactElement;
};

export const IntegrationCard: Component<IntegrationCardProps> = ({ integration, actionButton, showConfigureButton = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (): void => setIsHovered(true);
  const handleMouseLeave = (): void => setIsHovered(false);

  return (
    <Card
      className={"rounded-lg transition-colors w-full"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: !isHovered ? `${integration.bg}1A` : `${integration.bg}2A`,
        borderColor: !isHovered ? `${integration.bg}1A` : `${integration.bg}4A`,
        borderWidth: 2.5
      }}
    >
      <CardHeader className={cn("flex flex-row items-center", {
        "-mt-3": !showConfigureButton
      })}>
        <div>{integration.icon}</div>

        <div className="ml-4">
          <CardTitle className="mb-1 flex items-center">
            {integration.name}
            {!integration.available && <Badge className="ml-2" variant={"outline"}>Coming Soon</Badge>}
          </CardTitle>
          <CardDescription>{integration.description}</CardDescription>
        </div>
      </CardHeader>

      {showConfigureButton && integration.available && (
        <CardFooter className="flex justify-end">
          {actionButton || <Button size={"sm"} variant={"outline"} disabled={!integration.available}>Configure</Button>}
        </CardFooter>
      )}
    </Card>
  );
};