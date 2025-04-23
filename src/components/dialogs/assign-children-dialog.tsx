import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './base-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Child } from '@/types/child';
import { Group } from '@/types/group';

interface AssignChildrenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (group: Group) => void;
  children: Child[];
  groups: Group[];
  isLoading?: boolean;
}

export function AssignChildrenDialog({
  open,
  onOpenChange,
  onSubmit,
  children,
  groups,
  isLoading = false,
}: AssignChildrenDialogProps) {
  const { t } = useTranslation();
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

  const handleSubmit = () => {
    if (selectedGroup) {
      onSubmit(selectedGroup);
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('groups.assignChildren')}
      description={t('groups.assignChildrenDescription')}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t('groups.selectGroup')}</Label>
          <Select
            value={selectedGroup?.id}
            onValueChange={(value) => {
              const group = groups.find((g) => g.id === value);
              setSelectedGroup(group || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('groups.selectGroupPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('groups.selectedChildren')}</Label>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {children.map((child) => (
              <div key={child.id} className="py-1">
                {child.firstName} {child.lastName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseDialog>
  );
} 