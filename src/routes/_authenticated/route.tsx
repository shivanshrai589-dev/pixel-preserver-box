import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,

  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();

    // Not logged in → send to admin login
    if (error || !data.user) {
      throw redirect({ to: "/admin/login" });
    }

    // Check whether this user has the admin role
    const { data: isAdmin, error: roleError } = await supabase.rpc(
      "has_role",
      {
        _user_id: data.user.id,
        _role: "admin",
      },
    );

    // Logged in but NOT an admin → block access
    if (roleError || !isAdmin) {
      throw redirect({ to: "/admin/login" });
    }

    return {
      user: data.user,
    };
  },

  component: () => <Outlet />,
});
