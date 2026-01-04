'use client';

import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Clock, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

interface ServiceTypeForm {
  id?: string;
  name: string;
  durationMinutes: number;
  description: string;
  isActive: boolean;
}

const defaultForm: ServiceTypeForm = {
  name: '',
  durationMinutes: 30,
  description: '',
  isActive: true,
};

export function ServiceTypesTab() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceTypeForm>(defaultForm);
  const isEditing = !!form.id;

  const { data: serviceTypes } = useSuspenseQuery(
    trpc.settings.getServiceTypes.queryOptions()
  );

  const { mutate: createService, isPending: isCreating } = useMutation(
    trpc.settings.createServiceType.mutationOptions({
      onSuccess: () => {
        toast.success('Usluga kreirana');
        queryClient.invalidateQueries({
          queryKey: trpc.settings.getServiceTypes.queryKey(),
        });
        closeDialog();
      },
      onError: (error) => {
        toast.error('Greška', { description: error.message });
      },
    })
  );

  const { mutate: updateService, isPending: isUpdating } = useMutation(
    trpc.settings.updateServiceType.mutationOptions({
      onSuccess: () => {
        toast.success('Usluga ažurirana');
        queryClient.invalidateQueries({
          queryKey: trpc.settings.getServiceTypes.queryKey(),
        });
        closeDialog();
      },
      onError: (error) => {
        toast.error('Greška', { description: error.message });
      },
    })
  );

  const { mutate: deleteService, isPending: isDeleting } = useMutation(
    trpc.settings.deleteServiceType.mutationOptions({
      onSuccess: () => {
        toast.success('Usluga obrisana');
        queryClient.invalidateQueries({
          queryKey: trpc.settings.getServiceTypes.queryKey(),
        });
        setDeleteId(null);
      },
      onError: (error) => {
        toast.error('Greška', { description: error.message });
      },
    })
  );

  const closeDialog = () => {
    setIsDialogOpen(false);
    setForm(defaultForm);
  };

  const openCreate = () => {
    setForm(defaultForm);
    setIsDialogOpen(true);
  };

  const openEdit = (service: (typeof serviceTypes)[0]) => {
    setForm({
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
      description: service.description ?? '',
      isActive: service.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('Naziv je obavezan');
      return;
    }

    if (isEditing) {
      updateService({
        id: form.id!,
        name: form.name,
        durationMinutes: form.durationMinutes,
        description: form.description || undefined,
        isActive: form.isActive,
      });
    } else {
      createService({
        name: form.name,
        durationMinutes: form.durationMinutes,
        description: form.description || undefined,
        isActive: form.isActive,
      });
    }
  };

  const toggleActive = (service: (typeof serviceTypes)[0]) => {
    updateService({
      id: service.id,
      isActive: !service.isActive,
    });
  };

  const isPending = isCreating || isUpdating;

  return (
    <>
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-6 py-4">
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <span>Tipovi usluga</span>
            <Button size="sm" className="gap-2" onClick={openCreate}>
              <Plus className="size-4" />
              Dodaj uslugu
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {serviceTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Clock className="size-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Nema definisanih tipova usluga
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Kliknite &quot;Dodaj uslugu&quot; za kreiranje nove usluge
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Naziv</TableHead>
                  <TableHead className="w-[100px]">Trajanje</TableHead>
                  <TableHead className="hidden md:table-cell">Opis</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Status
                  </TableHead>
                  <TableHead className="w-[100px] text-right">Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceTypes.map((service) => (
                  <TableRow
                    key={service.id}
                    className={cn(!service.isActive && 'opacity-60')}
                  >
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-[300px] truncate text-muted-foreground md:table-cell">
                      {service.description || '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={service.isActive ? 'default' : 'secondary'}
                        className={cn(
                          'cursor-pointer transition-colors',
                          service.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                        onClick={() => toggleActive(service)}
                      >
                        {service.isActive ? 'Aktivan' : 'Neaktivan'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(service)}
                          className="size-8"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(service.id)}
                          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Izmeni uslugu' : 'Nova usluga'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Izmenite podatke o usluzi'
                : 'Unesite podatke za novu uslugu'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naziv usluge *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="npr. Čišćenje kamenca"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Trajanje (minuti)</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                max={480}
                step={5}
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationMinutes: parseInt(e.target.value) || 30,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis (opciono)</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Kratak opis usluge..."
                className="min-h-20 resize-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="isActive" className="font-medium">
                  Aktivna usluga
                </Label>
                <p className="text-sm text-muted-foreground">
                  Neaktivne usluge neće biti prikazane
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isPending}
            >
              Otkaži
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? 'Sačuvaj' : 'Kreiraj'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obrisati uslugu?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija je nepovratna. Usluga će biti trajno obrisana.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteService({ id: deleteId })}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Brisanje...
                </>
              ) : (
                'Obriši'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
