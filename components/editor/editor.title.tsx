import type { Component } from "../component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import type { EditorElementProps } from "./editor.types";

export const EditorTitle: Component<EditorElementProps> = ({ setValue, activeIndex, postInfo }) => (
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Enter the title of the post.</CardDescription>
    </CardHeader>

    <CardContent>
      <Input
        id="title"
        placeholder="The story about my cat"
        value={postInfo[activeIndex].title}
        onChange={(event) => setValue(event.target.value)}
      />
    </CardContent>
  </Card>
);