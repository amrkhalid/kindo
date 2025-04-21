
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/types";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRole: (role: any) => void;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  onAddRole,
}: AddRoleDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    identity: "",
    role: "staff" as Role,
  });

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

    const newRole = {
      ...form,
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    onAddRole(newRole);
    toast({
      title: "Role added",
      description: `${form.username} has been added as ${form.role}`,
    });
    
    // Reset form and close dialog
    setForm({
      username: "",
      email: "",
      identity: "",
      role: "staff",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Role</DialogTitle>
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
            <Button type="submit">Add Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
