import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import { Card, CardContent } from "@/components/ui/card";
import { BanIcon, NotepadText } from "lucide-react";
import { dayJS } from "@/dayjs/day-js";
import type { AsyncComponent } from "@/components/utils/component";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DisableKeyDialog, NewKeyDialog } from "@/components/new-api-key.dialog";
import { getKeyLU } from "../../api/utils";
import { Suspense } from "react";
import { hideKey } from "@/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type PageProps = {
  params: {
    project: string;
  };
}

const Keys: AsyncComponent<PageProps> = async({ params }) => {
  const { project } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const keys = await db.aPIKey.findMany({
    where: {
      projectId: project,
      authorId: user?.id
    }
  });

  return (
    <PageLayout
      title="API"
      description="Manage your API keys and generate new ones."
      center={false}
      projectId={project}
      actions={(
        <div className="flex gap-2">
          <NewKeyDialog projectId={project}>
            <Button>Generate API Key</Button>
          </NewKeyDialog>
          <Button variant="secondary">See docs</Button>
        </div>
      )}
    >
      <Card>
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Used</TableHead>
                {keys.some(key => key.status === "INACTIVE") && (
                  <TableHead>Disabled At</TableHead>
                )}
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.length > 0 ? keys.map((key, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="flex items-center gap-2">
                            {key.name}
                            <InfoCircledIcon className="w-4 h-4 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {hideKey(key.key)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell>
                    <Badge variant={
                      key.status === "ACTIVE" ? "default" : "destructive"
                    }>{key.status}</Badge>
                  </TableCell>

                  <TableCell>
                    <TooltipProvider>
                      {/* wait 2 hours before showing the tooltip on a youtube record, send me the link of the video and i buy you a coffee */}
                      <Tooltip delayDuration={!key.note ? 7200 : 200}>
                        <TooltipTrigger disabled={!key.note}>
                          <Button size={"icon"} variant={"secondary"} disabled={!key.note}>
                            <NotepadText className="w-4 h-4"/>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {key.note ? key.note : "Send me the link of the video and I buy you a coffee."}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-muted-foreground">{dayJS(key.createdAt).format("DD MMM YYYY")}</span>
                  </TableCell>

                  <TableCell>
                    {(async() => {
                      const lastUse = await getKeyLU(key.key);
                      return (
                        <Suspense fallback={<div>Loading...</div>}>
                          <span className="text-sm text-muted-foreground">{lastUse}</span>
                        </Suspense>
                      );
                    })()}
                  </TableCell>

                  {key.status === "INACTIVE" ? (
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{dayJS(key.disabledAt).format("DD MMM YYYY")}</span>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <span className="text-sm text-muted-foreground">-</span>
                    </TableCell>
                  )}

                  <TableCell>
                    {key.status === "ACTIVE" ? (
                      <DisableKeyDialog keyId={key.id} projectId={project}>
                        <Button size={"icon"} variant={"secondary"}>
                          <BanIcon className="w-4 h-4"/>
                        </Button>
                      </DisableKeyDialog>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <span className="text-muted-foreground">No API keys found.</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
};


export default Keys;