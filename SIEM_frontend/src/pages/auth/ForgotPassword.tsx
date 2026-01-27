/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/auth/ForgotPassword.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

const forgotSchema = z.object({
  email_utilisateur: z.string().email("Adresse email invalide"),
});

export type ForgotForm = z.infer<typeof forgotSchema>;


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email_utilisateur: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err: any) => {
      console.error(err);
      // Tu peux ajouter un toast ici plus tard
    },
  });

  const onSubmit = (data: ForgotForm) => {
    mutation.mutate(data);
  };

  if (success) {
      return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
              <div className="max-w-md w-full space-y-8 p-8 text-center">
                  <div className="inline-flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-6">
                      <Mail className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                      Vérifiez votre boîte mail
                  </h1>
                  <p className="text-slate-400 mb-8">
                      Nous vous avons envoyé un lien de réinitialisation. Vérifiez votre boîte de réception (et vos spams).
                  </p>
                  <button
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                  >
                      <ArrowLeft size={16} /> Retour à la connexion
                  </button>
              </div>
          </div>
      );
  }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Mot de passe oublié ?
                    </h1>
                    <p className="text-slate-400">
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                {...register('email_utilisateur')}
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="vous@exemple.com"
                            />
                        </div>
                        {errors.email_utilisateur && (
                            <p className="mt-1 text-sm text-red-400">{errors.email_utilisateur.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Envoi en cours...' : 'Envoyer le lien'}
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