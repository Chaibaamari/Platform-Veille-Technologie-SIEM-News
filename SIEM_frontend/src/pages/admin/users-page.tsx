/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, UserPlus, Edit } from 'lucide-react';
import BlogHero from '@/components/hero/BlogHero';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: Array<{ id: number; name: string }>;
  favorite_categories?: string[];
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient({ queryKey: ['users'] })
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      return apiMutation('users', {
        method: 'POST',
        body: JSON.stringify({
          ...newUser,
          roles: [{ id: getRoleId(newUser.role), name: newUser.role }],
          favorite_categories: newUser.role === 'user' ? [] : undefined
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateOpen(false);
      resetForm();
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiMutation(`users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...data,
          roles: [{ id: getRoleId(data.role), name: data.role }]
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditOpen(false);
      setSelectedUser(null);
      resetForm();
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiMutation(`users/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const getRoleId = (role: string) => {
    const roleMap: any = {
      admin: 1,
      veilleur: 2,
      analyste: 3,
      user: 4
    };
    return roleMap[role] || 4;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const handleCreate = () => {
    createUserMutation.mutate(formData);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.roles[0]?.name || 'user'
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        data: {
          ...formData,
          password: formData.password || undefined
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: any = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      veilleur: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      analyste: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      user: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[role] || colors.user;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-slate-950">
            <BlogHero title="GESTION UTILISATEURS" />
      
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Liste des Utilisateurs</h2>
                            <p className="text-slate-400 mt-1">
                                Gérez tous les utilisateurs du système
                            </p>
                        </div>
            
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Créer un utilisateur
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 text-white border-slate-700">
                                <DialogHeader>
                                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Ajoutez un nouvel utilisateur au système
                                    </DialogDescription>
                                </DialogHeader>
                
                                <div className="space-y-4 py-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                  
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                  
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                                            Mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                  
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                                            Rôle
                                        </label>
                                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                <SelectItem value="admin">Administrateur</SelectItem>
                                                <SelectItem value="veilleur">Veilleur</SelectItem>
                                                <SelectItem value="analyste">Analyste</SelectItem>
                                                <SelectItem value="user">Utilisateur</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button
                                        onClick={handleCreate}
                                        disabled={createUserMutation.isPending}
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        {createUserMutation.isPending ? 'Création...' : 'Créer'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border border-slate-700 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-800 hover:bg-slate-800">
                                    <TableHead className="text-slate-300 font-semibold">ID</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Nom</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Email</TableHead>
                                    <TableHead className="text-slate-300 font-semibold">Rôle</TableHead>
                                    <TableHead className="text-slate-300 font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user: User) => (
                                    <TableRow key={user.id} className="border-slate-700 hover:bg-slate-800/50">
                                        <TableCell className="text-slate-300 font-medium">#{user.id}</TableCell>
                                        <TableCell className="text-white font-medium">{user.name}</TableCell>
                                        <TableCell className="text-slate-300">{user.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.roles[0]?.name)}`}>
                                                {user.roles[0]?.name.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleEdit(user)}
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Edit Dialog */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="bg-slate-800 text-white border-slate-700">
                            <DialogHeader>
                                <DialogTitle>Modifier l'utilisateur</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Modifiez les informations de l'utilisateur
                                </DialogDescription>
                            </DialogHeader>
              
                            <div className="space-y-4 py-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>
                
                                <div>
                                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>
                
                                <div>
                                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Nouveau mot de passe (laisser vide pour ne pas changer)
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                
                                <div>
                                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Rôle
                                    </label>
                                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="admin">Administrateur</SelectItem>
                                            <SelectItem value="veilleur">Veilleur</SelectItem>
                                            <SelectItem value="analyste">Analyste</SelectItem>
                                            <SelectItem value="user">Utilisateur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
              
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    disabled={updateUserMutation.isPending}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {updateUserMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mt-8">
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Total Utilisateurs</div>
                        <div className="text-white text-3xl font-bold mt-2">{users?.length || 0}</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Administrateurs</div>
                        <div className="text-red-400 text-3xl font-bold mt-2">
                            {users?.filter((u: User) => u.roles[0]?.name === 'admin').length || 0}
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Veilleurs</div>
                        <div className="text-blue-400 text-3xl font-bold mt-2">
                            {users?.filter((u: User) => u.roles[0]?.name === 'veilleur').length || 0}
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Analystes</div>
                        <div className="text-purple-400 text-3xl font-bold mt-2">
                            {users?.filter((u: User) => u.roles[0]?.name === 'analyste').length || 0}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}