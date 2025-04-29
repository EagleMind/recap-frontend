import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import { CheckCircle2, XCircle } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export default function AccountPage() {
  const { user, loading, error, fetchUser, updateUser } = useUserStore();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) fetchUser();
    else setForm({ name: user.name, email: user.email });
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setSuccess("");
    await updateUser(form);
    if (!error) {
      setSuccess("Account updated successfully!");
    }
  };

  if (loading || !user) {
    return (
      <div className="p-6">
        <p>Loading account information...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                This is your public display name.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Your primary email address.
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={
                  typeof user.role === "string" ? user.role : "No role assigned"
                }
                readOnly
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Your current system role.
              </p>
            </div>

            {/* Verification Status */}
            <div className="space-y-2">
              <Label>Verification Status</Label>
              <div className="flex items-center gap-2">
                {user.isVerified ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>Not Verified</span>
                    <Button size="sm" variant="outline" className="ml-2">
                      Verify Account
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Your account verification status.
              </p>
            </div>

            {/* Update Button */}
            <div className="pt-4 space-y-2">
              <Button onClick={handleUpdate} disabled={loading}>Update account</Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
