import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let user: any = null;
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      user = sessionData.session.user;
    } else {
      const { data: userData } = await supabase.auth.getUser();
      user = userData?.user;
    }

    if (!user) {
      throw redirect({ to: "/auth" });
    }

    if (user.email === "admin@admin.com") {
      return { user };
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      throw redirect({ to: "/auth" });
    }
    return { user };
  },
  component: () => <Outlet />,
});