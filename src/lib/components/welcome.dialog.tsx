/* eslint-disable max-len */
"use client";

import { useVistedStore } from "@/store/data.store";
import { useState, type ReactElement } from "react";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dayJS } from "@/dayjs/day-js";

const MAX_TOURS = 3;

type WelcomeTour = {
  title: string;
  description: ReactElement;
  image: string;
  pos: number;
};

const Tours: WelcomeTour[] = [
  {
    title: "Welcome to Simplist",
    description: <>Simplist is a simple, fast posting API. Post your content in the simplest way possible, and just get your content back with an API</>,
    image: "/_static/welcome.png",
    pos: 0
  },
  {
    title: "Write your content",
    description: <>Write your content using markdown (or not, it&apos;s up to you!) add a banner, and even custom metadata.</>,
    image: "/_static/welcome_posts.png",
    pos: 1
  },
  {
    title: "Get your content",
    description: <>Get your content via our API and integrate it into your website, blog, or application simply and quickly.</>,
    image: "/_static/welcome_api.png",
    pos: 2
  },
  {
    title: "And analyze it",
    description: <>Based on the requests you make, Simplist allows you to see the statistics of your articles, such as the number of views.</>,
    image: "/_static/welcome_analytics.png",
    pos: 3
  }
];

export const WelcomeDialog = (): ReactElement => {
  const { hasVisited, setHasVisited } = useVistedStore();
  const [tour, setTour] = useState<WelcomeTour>(Tours[0]);

  return (
    <Dialog defaultOpen={!hasVisited} open={!hasVisited}>
      <DialogContent className="max-w-xl p-0 overflow-hidden" black hiddenX>
        <div className="aspect-video relative flex items-center">
          <Image
            src={tour.image + "?d=" + dayJS().format("YYYYMMDDHHmmss")}
            alt="Welcome to Simplist"
            fill
            quality={100}
            objectFit="cover"
          />
        </div>

        <div className="p-5">
          <h2 className="text-2xl font-semibold">{tour.title}</h2>
          <p className="text-muted-foreground mt-2">
            {tour.description}
          </p>

          <DialogFooter className="mt-3">
            {(tour.pos) === MAX_TOURS ? (
              <>
                <Button onClick={() => setTour(Tours[tour.pos - 1])} size={"icon"}>
                  <ArrowLeft size={19} />
                </Button>

                <Button onClick={() => setHasVisited()}>
                Let&apos;s go
                </Button>
              </>
            ) : (
              <>
                {tour.pos !== 0 && (
                  <Button onClick={() => setTour(Tours[tour.pos - 1])} size={"sm"}>
                    <ArrowLeft size={19} />
                    <span className="ml-2">Previous</span>
                  </Button>
                )}
                <Button onClick={() => setTour(Tours[tour.pos + 1])} size={"sm"}>
                  <span className="mr-2">Next</span>
                  <ArrowRight size={19} />
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};