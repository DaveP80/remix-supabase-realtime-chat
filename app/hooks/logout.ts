import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';

const useLogout = (supabase: any, session: any) => {
    const navigate = useNavigate();
    useEffect(() => {
        const handleLogout = async () => {
            await supabase.auth.signOut();
            localStorage.removeItem(`${session?.user.id}`);
        };
        handleLogout();
        navigate("/");
    }, [supabase, session]);

};

export default useLogout;