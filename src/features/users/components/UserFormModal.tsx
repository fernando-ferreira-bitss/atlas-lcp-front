import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useCreateUser, useUpdateUser } from '../hooks/useUsers';

import type { User } from '@/shared/types';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const userSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional().or(z.literal('')),
  is_admin: z.boolean(),
  is_active: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserFormModal = ({ isOpen, onClose, user }: UserFormModalProps) => {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isLoading = createUser.isPending || updateUser.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      is_admin: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome,
        email: user.email,
        password: '',
        is_admin: user.is_admin,
        is_active: user.is_active,
      });
    } else {
      reset({
        nome: '',
        email: '',
        password: '',
        is_admin: false,
        is_active: true,
      });
    }
  }, [user, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (user) {
        // Update
        const updateData: Record<string, unknown> = {
          nome: data.nome,
          email: data.email,
          is_admin: data.is_admin,
          is_active: data.is_active,
        };
        if (data.password) {
          updateData.password = data.password;
        }
        await updateUser.mutateAsync({ id: user.id, data: updateData });
      } else {
        // Create
        if (!data.password) {
          throw new Error('Senha é obrigatória para novo usuário');
        }
        await createUser.mutateAsync({
          nome: data.nome,
          email: data.email,
          password: data.password,
          is_admin: data.is_admin,
        });
      }
      handleClose();
    } catch (error) {
      // Errors are handled by the mutation hooks
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {user
                ? 'Atualize os dados do usuário abaixo.'
                : 'Preencha os dados do novo usuário.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Nome completo"
                disabled={isLoading}
              />
              {errors.nome && (
                <p className="text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                Senha {user && <span className="text-sm font-normal text-muted-foreground">(deixe em branco para manter a atual)</span>}
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder={user ? 'Nova senha (opcional)' : 'Senha'}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="is_admin"
                  type="checkbox"
                  {...register('is_admin')}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={isLoading}
                />
                <Label htmlFor="is_admin" className="cursor-pointer">
                  Administrador
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={isLoading}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Ativo
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
