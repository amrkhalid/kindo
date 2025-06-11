
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Child } from "@/types";
import { CheckboxGroup } from "./checkbox-group";

interface AddGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGroup: (group: any) => void;
  availableChildren: Child[];
  staffMembers: string[];
}

export function AddGroupDialog({
  open,
  onOpenChange,
  onAddGroup,
  availableChildren,
  staffMembers,
}: AddGroupDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    staffName: "",
    children: [] as Child[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.staffName || form.children.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields and select at least one child",
        variant: "destructive",
      });
      return;
    }

    const newGroup = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    onAddGroup(newGroup);
    toast({
      title: "Group added",
      description: `${form.name} group has been created successfully`,
      variant: "success"
    });
    
    // Reset form and close dialog
    setForm({
      name: "",
      staffName: "",
      children: [],
    });
    onOpenChange(false);
  };

  const handleChildrenChange = (selectedChildren: Child[]) => {
    setForm({ ...form, children: selectedChildren });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Group name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Member</Label>
            <select 
              id="staffName" 
              value={form.staffName}
              onChange={(e) => setForm({ ...form, staffName: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select staff member</option>
              {staffMembers.map((staff) => (
                <option key={staff} value={staff}>
                  {staff}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Select Children</Label>
            <CheckboxGroup 
              items={availableChildren} 
              selectedItems={form.children}
              onChange={handleChildrenChange}
              renderLabel={(child) => `${child.firstName} ${child.lastName}`}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
