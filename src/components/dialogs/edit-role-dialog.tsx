import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/types";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditRole: (role: any) => void;
  role: any;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  onEditRole,
  role,
}: EditRoleDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    identity: "",
    role: "staff" as Role,
  });

  useEffect(() => {
    if (role) {
      setForm({
        username: role.username,
        email: role.email,
        identity: role.identity,
        role: role.role,
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.identity) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedRole = {
      ...role,
      ...form,
      updatedAt: new Date().toISOString(),
    };

    onEditRole(updatedRole);
    toast({
      title: "Role updated",
      description: `${form.username}'s role has been updated`,
      variant: "success"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identity">ID Number</Label>
            <Input
              id="identity"
              value={form.identity}
              onChange={(e) => setForm({ ...form, identity: e.target.value })}
              placeholder="Identity number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.role}
              onValueChange={(value: Role) => setForm({ ...form, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Update Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 