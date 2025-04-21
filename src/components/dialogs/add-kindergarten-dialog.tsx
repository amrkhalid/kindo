
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface AddKindergartenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddKindergarten: (kindergarten: any) => void;
}

export function AddKindergartenDialog({
  open,
  onOpenChange,
  onAddKindergarten,
}: AddKindergartenDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phoneNumber) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newKindergarten = {
      ...form,
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      createdBy: "Current User", // This would come from auth context
      createdAt: new Date().toISOString(),
    };

    onAddKindergarten(newKindergarten);
    toast({
      title: "Kindergarten added",
      description: `${form.name} has been added successfully`,
    });
    
    // Reset form and close dialog
    setForm({
      name: "",
      address: "",
      phoneNumber: "",
      isActive: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Kindergarten</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Kindergarten name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Full address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <DialogFooter>
            <Button type="submit">Add Kindergarten</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
