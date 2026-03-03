// src/components/Login.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { Logo } from './Logo';
import { MarketplaceSelector } from './MarketplaceSelector';
import { Marketplace } from '../types';
import { Globe } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<Marketplace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { language, setLanguage, t } = useI18n();

  // Отладочная информация
  console.log('Current language:', language);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email.trim(), password);
        if (error) throw error;
      } else {
        // Валидация полей для регистрации
        if (!fullName.trim()) {
          throw new Error(t('auth.enterName'));
        }
        if (!phone.trim()) {
          throw new Error(t('auth.enterPhone'));
        }
        if (!email.trim()) {
          throw new Error(t('auth.enterEmail'));
        }
        if (!password.trim()) {
          throw new Error(t('auth.enterPassword'));
        }
        if (password.length < 6) {
          throw new Error(t('auth.passwordMinLength'));
        }
        if (password !== confirmPassword) {
          throw new Error(t('auth.passwordsDoNotMatch'));
        }
        if (selectedMarketplaces.length === 0) {
          throw new Error(t('auth.selectMarketplace'));
        }
        
        // При регистрации сохраняем выбранные маркетплейсы
        const { error } = await signUp(email.trim(), password, fullName.trim(), selectedMarketplaces);
        if (error) throw error;
        
        // Показываем сообщение об успешной регистрации
        setSuccess(t('auth.registrationSuccess'));
      }
    } catch (e: any) {
      console.error('Ошибка авторизации:', e);
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={language} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center p-6 relative">
      {/* Language Switcher - Bottom Left */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <Globe size={20} className="text-slate-600" />
        <button
          onClick={() => {
            console.log('Switching to Russian');
            setLanguage('ru');
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            language === 'ru'
              ? 'bg-red-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
          }`}
        >
          RU
        </button>
        <button
          onClick={() => {
            console.log('Switching to English');
            setLanguage('en');
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            language === 'en'
              ? 'bg-red-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
          }`}
        >
          EN
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo at top */}
        <div className="text-center mb-8">
          <Logo className="justify-center" />
        </div>
        
        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800">{isLogin ? t('auth.login') : t('auth.register')}</h1>
            <p className="text-slate-600 mt-2">{t('auth.subtitle')}</p>
          </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.fullName')}</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('auth.fullNamePlaceholder')}
            />
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.phone')}</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('auth.phonePlaceholder')}
            />
          </div>
        )}

        {!isLogin && (
          <div className="pt-4 border-t border-slate-200">
            <MarketplaceSelector
              key={language}
              selectedMarketplaces={selectedMarketplaces}
              onSelectionChange={setSelectedMarketplaces}
              title={t('auth.selectMarketplaces')}
              description={t('auth.selectMarketplacesDescription')}
              className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.email')}</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.password')}</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.confirmPassword')}</label>
            <input
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300'
              }`}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.confirmPasswordPlaceholder')}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{t('auth.passwordsDoNotMatch')}</p>
            )}
          </div>
        )}

        {error && <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}
        {success && <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">{success}</div>}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500">{t('auth.or')}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? t('auth.submitting') : isLogin ? t('auth.signIn') : t('auth.signUp')}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            onClick={() => setIsLogin((v) => !v)}
          >
            {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}