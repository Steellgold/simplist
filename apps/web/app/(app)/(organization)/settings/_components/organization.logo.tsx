"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import type { Component } from "@workspace/ui/components/utils/component"
import { type ChangeEvent, type FormEvent, useState } from "react"
import { Building2, Loader2, XIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { toast } from "@workspace/ui/hooks/use-toast"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"

type OrganizationSettingsLogoFormProps = {
  organizationId: string
  initialLogo: string
}

export const OrganizationSettingsLogoForm: Component<OrganizationSettingsLogoFormProps> = ({
  organizationId,
  initialLogo,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  const { refetch } = authClient.useActiveOrganization();

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    const selectedFile = files[0]

    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "The logo file must be less than 2MB.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogoPreview(reader.result)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setPending(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("organizationId", organizationId)

      const response = await fetch("/api/organizations/logo", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload logo")
      }

      const { url } = await response.json()

      await authClient.organization.update({
        data: {
          logo: url
        },
        fetchOptions: {
          onError: (error) => {
            console.error("Update error:", error)
            toast({
              title: "Update failed",
              description:
                error instanceof Error ? error.message : "There was an error updating your logo. Please try again.",
              variant: "destructive",
            })
          },
          onRequest: () => {
            setPending(true)
          },
          onSuccess: () => {
            setPending(false)
            toast({
              title: "Logo updated",
              description: "Your organization logo has been successfully updated.",
            });

            refetch();
          }
        },
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "There was an error uploading your logo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Logo</CardTitle>
          <CardDescription>The logo for your organization that appears in the header</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-20 rounded-lg flex items-center justify-center overflow-hidden bg-muted relative inline-flex">
                {logoPreview || initialLogo ? (
                  <Image
                    src={logoPreview || initialLogo}
                    alt="Organization logo"
                    className="h-full w-full p-1 object-cover"
                    width={80}
                    height={80}
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              {logoPreview && (
                <Button
                  onClick={() => {
                    setLogoPreview(null)
                    setFile(null)
                  }}
                  size="icon"
                  variant="destructive"
                  className="border-background absolute -top-2 -right-2 size-6 rounded-full border-2"
                  aria-label="Remove image"
                >
                  <XIcon size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-1.5">
              <Input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />

              <Label htmlFor="logo-upload">
                <Button variant="outline" size={"sm"} className="cursor-pointer" asChild>
                  <span>Upload New Logo</span>
                </Button>
              </Label>

              <p className="text-sm text-muted-foreground">
                Max file size: <strong>2MB</strong>. Recommended dimensions: <strong>200x200</strong> pixels.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter vercelStyle>
          <p className="text-sm text-muted-foreground">
            An avatar is optional but strongly recommended to help if you have multiple organizations.
          </p>
          <Button size={"sm"} type="submit" disabled={pending || !file}>
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}