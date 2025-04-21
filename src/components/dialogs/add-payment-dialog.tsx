
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Child } from "@/types";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (payment: any) => void;
  children: Child[];
}

const paymentMethods = ["Credit Card", "Cash", "Bank Transfer", "Check"];
const paymentStatuses = ["paid", "pending", "overdue"];

export function AddPaymentDialog({
  open,
  onOpenChange,
  onAddPayment,
  children,
}: AddPaymentDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    childId: "",
    parentEmail: "",
    amount: "",
    paymentMethod: "",
    paymentDate: "",
    status: "pending" as "paid" | "pending" | "overdue",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childId || !form.parentEmail || !form.amount || !form.paymentMethod || !form.paymentDate) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedChild = children.find(child => child.id === form.childId);
    const childName = selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : "";

    const newPayment = {
      id: crypto.randomUUID(),
      childName,
      parentEmail: form.parentEmail,
      amount: parseFloat(form.amount),
      paymentMethod: form.paymentMethod,
      paymentDate: form.paymentDate,
      status: form.status,
      createdAt: new Date().toISOString(),
    };

    onAddPayment(newPayment);
    toast({
      title: "Payment added",
      description: `Payment of ${form.amount} added for ${childName}`,
    });
    
    // Reset form and close dialog
    setForm({
      childId: "",
      parentEmail: "",
      amount: "",
      paymentMethod: "",
      paymentDate: "",
      status: "pending",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="childId">Child</Label>
            <Select
              value={form.childId}
              onValueChange={(value) => setForm({ ...form, childId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {`${child.firstName} ${child.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentEmail">Parent Email</Label>
            <Input
              id="parentEmail"
              type="email"
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
              placeholder="Parent email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Payment amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={form.paymentMethod}
              onValueChange={(value) => setForm({ ...form, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={form.paymentDate}
              onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value: "paid" | "pending" | "overdue") => 
                setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Add Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
