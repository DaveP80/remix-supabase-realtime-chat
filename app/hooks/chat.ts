export const handleLogout = (supabase: any) => {
  supabase.auth.signOut();
};

export const handleNavigate = (navigate: any, args: string) => {
  navigate(`/${args}`);
};
