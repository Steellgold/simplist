import type { GetPostType } from "@/lib/actions/post/post.types";
import type { Component } from "./component";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { SparkAreaChart } from "./ui/tremor/spark-chart";
import { dayJS } from "@/lib/day-js";
import Image from "next/image";
import Link from "next/link";
import { Archive, Calendar, Copy, Edit } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { CategoryTag, PostTag } from "./post-tag";
import type { Organization } from "@/lib/ba.types";

const generateChartData = (): { month: string; Performance: number }[] => Array.from({ length: 18 }, (_, index) => ({
  month: dayJS().subtract(17 - index, "months").format("MMM YY"),
  Performance: Math.floor(Math.random() * 100)
}));

export const PostCard: Component<{ post: GetPostType; organization: Organization }> = ({ post }) => (
  <Card className="relative overflow-hidden">
    <div className="absolute inset-0 z-0 hidden dark:block bg-black/40">
      <Image
        src={post.banner?.url || "/"}
        alt=""
        fill
        className="object-cover scale-110 blur-3xl opacity-40"
      />
    </div>

    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between">
        <CardHeader className="flex flex-col md:flex-row gap-3 md:gap-0">
          <div className="relative w-full h-52 md:w-[300px] md:h-[10rem]">
            <Image src={post.banner?.url || "/_static/placeholder.png"} alt={post.title} fill className="rounded-lg object-cover" />
          </div>

          <PostDetails post={post} />
        </CardHeader>
      </div>

      <CardFooter className="flex gap-1.5 overflow-x-auto">
        <div className="flex flex-row gap-1 md:gap-0.5">
          <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={`/app/posts/${post.slug}`}>
            <Edit size={16} />
          </Link>
          <Button variant="outline" size="icon">
            <Copy size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <Archive size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {!post.published && <Badge variant={"tag-default"}>Draft</Badge>}

        {post.scheduledAt && !post.published && (
          <Badge variant={"tag-default"}>
            <Calendar size={14} />
            Scheduled for {dayJS(post.scheduledAt).format("MMM DD, YYYY")}
          </Badge>
        )}

        {post.variants.length >= 1 && (
          <Badge variant={"tag-default"}>
            {post.variants.length} Variant{post.variants.length > 1 ? "s" : ""}
          </Badge>
        )}

        {post.categories.map((category) => (
          <CategoryTag key={category.id} content={category.name} />
        ))}

        {post.tags.map((tag) => (
          <PostTag key={tag.id} color={tag.color} content={tag.name} />
        ))}
      </CardFooter>
    </div>
  </Card>
);

const PostDetails: Component<{ post: GetPostType }> = ({ post }) => (
  <div className="flex flex-col gap-3 md:ml-4">
    <div className="flex flex-col gap-1">
      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
      <CardDescription className="line-clamp-1">{post.excerpt}</CardDescription>
    </div>

    <div className={cn("relative w-full h-16 rounded-lg md:w-48 md:h-20", {
      "bg-primary/15 dark:bg-black/15": true,
      "dark:bg-primary/15": !post.banner?.url
    })}>
      <SparkAreaChart
        data={generateChartData()}
        categories={["Performance"]}
        index="month"
        colors={["yellow"]}
        className="w-full h-full"
      />
    </div>
  </div>
);