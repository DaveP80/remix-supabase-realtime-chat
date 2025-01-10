export const handleLogout = (supabase: any, session: any, navigate: any) => {
  supabase.auth.signOut();
  localStorage.removeItem(`${session?.user.id}`);
  navigate("/");
};

export const handleNavigate = (navigate: any, args: string) => {
  navigate(`/${args}`);
};
