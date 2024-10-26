import type { Component } from "../component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import type { EditorElementProps } from "./editor.types";

export const EditorContent: Component<EditorElementProps> = ({ setValue, activeIndex, postInfo }) => (
  <Card>
    <CardHeader>
      <CardTitle>Content</CardTitle>
      <CardDescription>Write the main content of the post.</CardDescription>
    </CardHeader>

    <CardContent>
      <Textarea
        id="content"
        placeholder="Once upon a time, there was a cat named Whiskers..."
        value={postInfo[activeIndex].content}
        onChange={(event) => setValue(event.target.value)}
        style={{ resize: "vertical", minHeight: "200px" }}
      />
    </CardContent>
  </Card>
);