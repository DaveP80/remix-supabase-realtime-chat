export const handleLogout = async(supabase: any, session: any, navigate: any) => {
  await supabase.auth.signOut();
  localStorage.removeItem(`${session?.user.id}`);
  navigate("/logout");
};

export const handleNavigate = (navigate: any, args: string) => {
  navigate(args);
};
