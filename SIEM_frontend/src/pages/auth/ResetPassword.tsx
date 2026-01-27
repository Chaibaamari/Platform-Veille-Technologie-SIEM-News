/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/auth/ResetPassword.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Shield, AlertCircle } from 'lucide-react';
import { authApi } from '@/api/auth';

const resetSchema = z.object({
  new_password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

    const mutation = useMutation({
        mutationFn: (data: { new_password: string; confirm_password: string }) =>
            authApi.ResetPassword(token!, data.new_password, data.confirm_password),
        onSuccess: () => {
            setSuccess(true);
            setApiError(null);
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.non_field_errors?.[0] ||
                'Erreur lors de la réinitialisation. Le lien est peut-être expiré.';
            setApiError(msg);
        },
    });

  const onSubmit = (formData: ResetForm) => {
    mutation.mutate({
      new_password: formData.new_password,
      confirm_password: formData.confirm_password,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md bg-slate-900/80 rounded-2xl p-10 text-center border border-red-900/50">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Lien invalide</h2>
          <p className="text-slate-300 mb-8">Ce lien semble incorrect ou a expiré.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white"
          >
            Nouveau lien
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md bg-slate-900/80 rounded-2xl p-10 text-center border border-green-800/30">
          <Shield className="w-20 h-20 mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Succès !</h1>
          <p className="text-slate-300 mb-8">Votre mot de passe a été modifié.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-6">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Nouveau mot de passe</h1>
                    <p className="text-slate-400 mt-3">Choisissez un mot de passe sécurisé</p>
                </div>

                {apiError && (
                    <div className="mb-6 bg-red-950/60 border border-red-800/60 text-red-300 px-5 py-4 rounded-xl text-sm">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                {...register('new_password')}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="Minimum 8 caractères"
                            />
                        </div>
                        {errors.new_password && <p className="text-red-400 text-sm">{errors.new_password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                {...register('confirm_password')}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="Confirmez votre mot de passe"
                            />
                        </div>
                        {errors.confirm_password && <p className="text-red-400 text-sm">{errors.confirm_password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-medium rounded-xl transition-all disabled:opacity-60"
                    >
                        {mutation.isPending ? 'Modification en cours...' : 'Modifier mon mot de passe'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                            ← Retour à la connexion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}