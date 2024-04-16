import { PageLayout } from "@/components/page.layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";

const Post = (): ReactElement => {
  return (
    <PageLayout
      bordered={false}
      center={false}
      actions={(
        <div className="flex gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button>Save Post</Button>
        </div>
      )}>
      <main className="grid items-start gap-4 mt-3">
        <div className="mx-auto max-w-full">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Post</CardTitle>
                  <CardDescription>This is the main information of the post.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Title</Label>
                      <Input id="title" type="text" className="w-full" defaultValue="Lorem ipsum dolor sit amet" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Excerpt</Label>
                      <Label htmlFor="description" className="text-muted-foreground text-sm -mt-2">A brief description of the post.</Label>

                      <Textarea
                        id="excerpt"
                        // eslint-disable-next-line max-len
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                        className="min-h-24 resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                  <CardDescription>
                    Add custom metadata to this post will be returned on the response API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Key</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="w-[100px]">Value</TableHead>
                        <TableHead className="w-[100px]">Action(s)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Label htmlFor="key" className="sr-only">Key</Label>
                          <Input id="key" type="text" defaultValue="hasProduct" />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="type" className="sr-only">Type</Label>
                          <Select defaultValue="boolean">
                            <SelectTrigger id="type" aria-label="Select type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        {/* TODO: Here show a checkbox if the type is boolean */}
                        <TableCell>
                          <Label htmlFor="value" className="sr-only">Value</Label>
                          <Input id="value" type="text" defaultValue="true" />
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="outline" className="gap-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button size="sm" variant="ghost" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Metadata
                  </Button>
                </CardFooter>
              </Card>

              {/* TODO: Add "Variants" card to add same post with different languages, and access to editor */}
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visibility</CardTitle>
                  <CardDescription>
                    Do you want to publish or draft this post?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue="draft">
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Post Banner</CardTitle>
                  <CardDescription>
                    On the response API it will return the URL of the image.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Image
                      alt="Product image"
                      className="aspect-video w-full rounded-md object-cover"
                      height="300"
                      width="300"
                      src="/_static/blank_banner.png"
                    />
                  </div>
                </CardContent>

                <CardFooter className="border-t p-4 justify-between">
                  <Button size="sm" variant="ghost" className="gap-1" disabled>
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Image
                  </Button>

                  <Button size="sm" variant="ghost" className="gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                  </Button>
                </CardFooter>
              </Card>

              {/*
                KEEP THIS COMMENTED: For the "/edit" page
                <Card>
                  <CardHeader>
                    <CardTitle>Archive Post</CardTitle>
                    <CardDescription>
                      This action will archive the post and it will not be available on the API.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Post
                    </Button>
                  </CardContent>
                </Card>
              */}
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Post;