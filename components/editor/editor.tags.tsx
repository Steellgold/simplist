import type { Component } from "../component";
import { TagSelector } from "../tag-selectors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { EditorSelectProps } from "./editor.types";

export const EditorTags: Component<EditorSelectProps> = ({ setValues, postInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>Add tags to your post to make it easier to find in your dashboard or on your blog.</CardDescription>
      </CardHeader>

      <CardContent>
        <TagSelector onSelect={setValues} selectedTags={postInfo[0].tags} />
      </CardContent>
    </Card>
  );
};