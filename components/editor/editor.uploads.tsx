import type { ReactElement } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import { Button } from "../ui/button";
import { Copy, X } from "lucide-react";

type File = {
  id: string;
  name: string;
  size: number;
  url: string;
}

const TEMPORARY_FILES: File[] = [
  { id: "1", name: "image1.jpg", size: 1024, url: "https://placeholderimage.eu/api/800/600" },
  { id: "2", name: "image2.jpg", size: 2048, url: "https://placeholderimage.eu/api/800/600" },
  { id: "3", name: "image3.jpg", size: 4096, url: "https://placeholderimage.eu/api/800/600" },
  { id: "4", name: "image4.jpg", size: 8192, url: "https://placeholderimage.eu/api/800/600" },
  { id: "5", name: "image5.jpg", size: 16384, url: "https://placeholderimage.eu/api/800/600" }
];

export const EditorUploads = (): ReactElement => (
  <Card>
    <CardHeader>
      <CardTitle>Images</CardTitle>
      <CardDescription>Upload and copy image URLs here for your post content.</CardDescription>
    </CardHeader>

    <CardContent className="flex flex-col">
      <TooltipProvider delayDuration={300}>
        {TEMPORARY_FILES.map((file) => (
          <div className="border rounded p-2 mb-2 flex items-center justify-between" key={file.id}>
            <Tooltip key={file.id}>
              <TooltipTrigger>
                <div>
                  <span>{file.name}</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>
                <Image src={file.url} width={150} height={150} alt={file.name} />
              </TooltipContent>
            </Tooltip>
            <div className="flex gap-1.5">
              <Button variant="default" size={"icon-sm"}>
                <Copy size={16} />
              </Button>

              <Button variant="destructive" size={"icon-sm"}>
                <X size={16} />
              </Button>
            </div>
          </div>
        ))}
      </TooltipProvider>
    </CardContent>

    <CardFooter className="flex justify-end">
      <Button size={"sm"} variant="default">Upload Image</Button>
    </CardFooter>
  </Card>
);