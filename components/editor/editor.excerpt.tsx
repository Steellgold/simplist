import type { Component } from "../component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import type { EditorElementProps } from "./editor.types";

export const EditorExcerpt: Component<EditorElementProps> = ({ setValue, activeIndex, postInfo }) => (
  <Card>
    <CardHeader>
      <CardTitle>Excerpt</CardTitle>
      <CardDescription>Enter a short summary of the post.</CardDescription>
    </CardHeader>

    <CardContent>
      <Textarea
        id="excerpt"
        placeholder="A short summary of the post."
        value={postInfo[activeIndex].excerpt}
        onChange={(event) => setValue(event.target.value)}
        style={{ resize: "none" }}
      />
    </CardContent>
  </Card>
);