import { useNavigation } from '@remix-run/react';

export function TransitionFlash() {
  const navigation = useNavigation();
  const isRedirecting = navigation.state === 'loading' && navigation.formAction !== undefined;

  if (!isRedirecting) return null;

  return (
    <div className="fixed inset-0 bg-white/80 animate-pulse flex items-center justify-center z-50">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg animate-bounce">
        Redirecting...
      </div>
    </div>
  );
}