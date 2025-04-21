
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChild: (child: any) => void;
}

export function AddChildDialog({
  open,
  onOpenChange,
  onAddChild,
}: AddChildDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    lastName: "",
    fatherIdNumber: "",
    motherIdNumber: "",
    birthDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.birthDate) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newChild = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    onAddChild(newChild);
    toast({
      title: "Child added",
      description: `${form.firstName} ${form.lastName} has been added successfully`,
    });
    
    // Reset form and close dialog
    setForm({
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      fatherIdNumber: "",
      motherIdNumber: "",
      birthDate: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Child</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name*</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="First name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondName">Second Name</Label>
            <Input
              id="secondName"
              value={form.secondName}
              onChange={(e) => setForm({ ...form, secondName: e.target.value })}
              placeholder="Second name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thirdName">Third Name</Label>
            <Input
              id="thirdName"
              value={form.thirdName}
              onChange={(e) => setForm({ ...form, thirdName: e.target.value })}
              placeholder="Third name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Last name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherIdNumber">Father ID Number</Label>
            <Input
              id="fatherIdNumber"
              value={form.fatherIdNumber}
              onChange={(e) => setForm({ ...form, fatherIdNumber: e.target.value })}
              placeholder="Father's ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherIdNumber">Mother ID Number</Label>
            <Input
              id="motherIdNumber"
              value={form.motherIdNumber}
              onChange={(e) => setForm({ ...form, motherIdNumber: e.target.value })}
              placeholder="Mother's ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date*</Label>
            <Input
              id="birthDate"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Child</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
