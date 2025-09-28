import { createUserAction } from "@/lib/actions"
import { serverAuthClient } from "@/lib/auth-server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FormOverlay } from "./client-form"

export default async function NewParentPage({ searchParams }: { searchParams: { error?: string; success?: string } }) {
  await serverAuthClient.requireAuth()

  async function handleCreateParent(formData: FormData) {
    "use server"

    formData.append("userType", "parent")

    const countryCode = formData.get("country_code") as string
    const rawPhone = formData.get("phone_number") as string
    if (countryCode && rawPhone) {
      formData.set("phone_number", `${countryCode}${rawPhone}`)
    }

    const spouseCountryCode = formData.get("spouse_country_code") as string
    const spouseRawPhone = formData.get("spouse_phone_number") as string
    if (spouseCountryCode && spouseRawPhone) {
      formData.set("spouse_phone_number", `${spouseCountryCode}${spouseRawPhone}`)
    }

    const result = await createUserAction(formData)

    if (result.error) {
      redirect("/admin/parents/new?error=" + encodeURIComponent(result.error))
    }

    if (result.success) {
      redirect("/admin/parents?success=" + encodeURIComponent(result.message || "Parent created successfully"))
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/parents">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Parents
          </Link>
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Parent</CardTitle>
          <CardDescription>Create a new parent account in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleCreateParent} className="space-y-4">
            <FormOverlay />
            {searchParams.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {searchParams.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" name="full_name" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <div className="flex gap-2">
                <Select name="country_code" defaultValue="+234" required>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+234">🇳🇬 +234 (Nigeria)</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91 (India)</SelectItem>
                    <SelectItem value="+27">🇿🇦 +27 (South Africa)</SelectItem>
                    <SelectItem value="+61">🇦🇺 +61 (Australia)</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49 (Germany)</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33 (France)</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81 (Japan)</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86 (China)</SelectItem>
                    <SelectItem value="+55">🇧🇷 +55 (Brazil)</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone_number" name="phone_number" type="tel" placeholder="7012345678" className="flex-1" required />
              </div>
             
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input id="date_of_birth" name="date_of_birth" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spouse_name">Spouse Name</Label>
              <Input id="spouse_name" name="spouse_name" type="text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spouse_email">Spouse Email</Label>
              <Input id="spouse_email" name="spouse_email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spouse_phone_number">Spouse Phone</Label>
              <div className="flex gap-2">
                <Select name="spouse_country_code" defaultValue="+234">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+234">🇳🇬 +234 (Nigeria)</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91 (India)</SelectItem>
                    <SelectItem value="+27">🇿🇦 +27 (South Africa)</SelectItem>
                    <SelectItem value="+61">🇦🇺 +61 (Australia)</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49 (Germany)</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33 (France)</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81 (Japan)</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86 (China)</SelectItem>
                    <SelectItem value="+55">🇧🇷 +55 (Brazil)</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="spouse_phone_number" name="spouse_phone_number" type="tel" placeholder="7012345678" className="flex-1" />
              </div>
        
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile_image">Profile Image URL</Label>
              <Input id="profile_image" name="profile_image" type="text" />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">Create Parent</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/parents">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
