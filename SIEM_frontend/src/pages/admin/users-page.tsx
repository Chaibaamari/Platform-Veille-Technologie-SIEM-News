/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, UserPlus, Edit, Mail, User, Lock, Shield } from 'lucide-react';

interface Users {
  id: number;
  username: string;
  email: string;
  role: string
  date_creation?: string;
  categories_suivies?: string[];
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Fetch users
    const { data , isLoading } = useQuery({
        queryKey: ['users/'],
        queryFn: () => apiClient({ queryKey: ['users/'] }),
        staleTime: 5000,
    });

    const users = data?.users ?? [];

  // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: async (newUser: any) => {
            return apiMutation('users/add', {
                method: 'POST',
                body: JSON.stringify({
                    nom_utilisateur: newUser.name,
                    email_utilisateur: newUser.email,
                    role_utilisateur: newUser.role,
                })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users/'] });
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
            return apiMutation(`users/${id}/delete/`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users/'] });
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
        if (!formData.name || !formData.email) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        createUserMutation.mutate(formData);
    };

    const handleEdit = (user: Users) => {
        setSelectedUser(user);
        setFormData({
            name: user.username,
            email: user.email,
            password: '',
            role: user.role
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
        deleteUserMutation.mutate(id);
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: any = {
            admin: 'bg-linear-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30',
            veilleur: 'bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
            analyste: 'bg-linear-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30',
            user: 'bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
        };
        return colors[role] || colors.user;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-slate-950 to-zinc-900">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 to-zinc-900">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Gestion des Utilisateurs</h2>
                        <p className="text-slate-400">
                            Gérez tous les utilisateurs du système et leurs permissions
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <button className="px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02]">
                                <UserPlus className="w-5 h-5" />
                                <span>Créer un utilisateur</span>
                            </button>
                        </DialogTrigger>
            
                        <DialogContent className="bg-linear-to-br from-slate-900 to-slate-800 text-white border border-slate-700/50 shadow-2xl max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                    Nouvel utilisateur
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 text-base">
                                    Ajoutez un nouvel utilisateur au système
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-5 py-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <User className="w-4 h-4 text-violet-400" />
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-violet-400" />
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-violet-400" />
                                        Rôle
                                    </label>
                                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 focus:ring-2 focus:ring-violet-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="admin" className="text-white hover:bg-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    Administrateur
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="veilleur" className="text-white hover:bg-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                    Veilleur
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="analyste" className="text-white hover:bg-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                                    Analyste
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="user" className="text-white hover:bg-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                    Utilisateur
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={createUserMutation.isPending}
                                    className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all"
                                >
                                    {createUserMutation.isPending ? 'Création...' : 'Créer'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
                        <div className="text-slate-400 text-sm font-medium">Total Utilisateurs</div>
                        <div className="text-white text-3xl font-bold mt-2">{users?.length || 0}</div>
                    </div>
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-red-500/20 p-6 shadow-lg">
                        <div className="text-slate-400 text-sm font-medium">Administrateurs</div>
                        <div className="text-red-400 text-3xl font-bold mt-2">
                            {users?.filter((u: Users) => u.role === 'admin').length || 0}
                        </div>
                    </div>
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-blue-500/20 p-6 shadow-lg">
                        <div className="text-slate-400 text-sm font-medium">Veilleurs</div>
                        <div className="text-blue-400 text-3xl font-bold mt-2">
                            {users?.filter((u: Users) => u.role === 'veilleur').length || 0}
                        </div>
                    </div>
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-purple-500/20 p-6 shadow-lg">
                        <div className="text-slate-400 text-sm font-medium">Analystes</div>
                        <div className="text-purple-400 text-3xl font-bold mt-2">
                            {users?.filter((u: Users) => u.role === 'analyste').length || 0}
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {users && users?.map((user: Users) => (
                        <div
                            key={user.id}
                            className="bg-linear-to-r from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 hover:border-violet-500/50 transition-all duration-300 shadow-lg hover:shadow-violet-500/10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-white font-semibold text-lg">{user.username}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Mail className="w-4 h-4" />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {users?.length === 0 && (
                        <div className="text-center py-16 bg-linear-to-r from-slate-900 to-slate-800 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-lg">Aucun utilisateur trouvé</p>
                            <p className="text-slate-500 text-sm mt-2">Créez votre premier utilisateur pour commencer</p>
                        </div>
                    )}
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="bg-linear-to-br from-slate-900 to-slate-800 text-white border border-slate-700/50 shadow-2xl max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                Modifier l'utilisateur
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-base">
                                Modifiez les informations de l'utilisateur
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 py-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <User className="w-4 h-4 text-violet-400" />
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-violet-400" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-violet-400" />
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                    placeholder="Laisser vide pour ne pas changer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-violet-400" />
                                    Rôle
                                </label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="admin" className="text-white hover:bg-slate-700">Administrateur</SelectItem>
                                        <SelectItem value="veilleur" className="text-white hover:bg-slate-700">Veilleur</SelectItem>
                                        <SelectItem value="analyste" className="text-white hover:bg-slate-700">Analyste</SelectItem>
                                        <SelectItem value="user" className="text-white hover:bg-slate-700">Utilisateur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={updateUserMutation.isPending}
                                className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/20"
                            >
                                {updateUserMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}