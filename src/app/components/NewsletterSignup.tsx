import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface NewsletterForm {
  email: string;
}

export default function NewsletterSignup() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterForm>();

  const onSubmit = async (data: NewsletterForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: data.email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation (already subscribed)
          toast.error('This email is already subscribed!');
        } else {
          toast.error('Failed to subscribe. Please try again later.');
          console.error('Subscription error:', error);
        }
      } else {
        toast.success('Successfully subscribed to our newsletter!');
        reset();
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 mt-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-2">
            <Mail className="w-6 h-6 text-blue-400" />
            Stay Updated
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Join our newsletter to receive the latest updates on our impact stories, upcoming events, and opportunities to make a difference.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex-1 max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`w-full bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-white placeholder-slate-500 rounded-xl py-3.5 pl-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe to newsletter"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 hidden sm:block" />
                  </>
                )}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs px-2">{errors.email.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
