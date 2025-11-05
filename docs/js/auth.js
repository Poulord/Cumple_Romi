(function () {

  const buildAdminDirectory = () => {
    const configuredUsers =
      window.RGG_ADMIN_USERS && typeof window.RGG_ADMIN_USERS === "object"
        ? window.RGG_ADMIN_USERS
        : {};

    const directory = {};

    Object.entries({ ...DEFAULT_ADMIN_USERS, ...configuredUsers }).forEach(
      ([email, data = {}]) => {
        const normalizedEmail = String(email || "").trim().toLowerCase();

        if (!normalizedEmail) {
          return;
        }

        directory[normalizedEmail] = {
          name: data.name || normalizedEmail,
          password: String(data.password || ""),
        };
      }
    );

    return directory;
  };

  let ADMIN_USERS = buildAdminDirectory();

  const reloadAdminDirectory = () => {
    ADMIN_USERS = buildAdminDirectory();
  };

  const STORAGE_KEY = "rgg-admin-session";

  const readStoredSession = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("No se pudo recuperar la sesión", error);
      return null;
    }
  };

  let CURRENT_SESSION = readStoredSession();

  const setSession = (session) => {
    CURRENT_SESSION = session || null;

    if (!session) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const sessionsAreEqual = (a, b) => {
    if (!a && !b) {
      return true;
    }

    if (!a || !b) {
      return false;
    }

    return (
      String(a.email || "").toLowerCase() === String(b.email || "").toLowerCase() &&
      String(a.name || "") === String(b.name || "") &&
      Boolean(a.isAdmin) === Boolean(b.isAdmin)
    );
  };

  const fetchOrCreateProfile = async (user) => {
    if (!user || !user.id) {
      return null;
    }

    if (!window.supabase || typeof supabase.from !== "function") {
      return null;
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name, is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.warn("No se pudo obtener el perfil del usuario", error);
        return null;
      }

      if (profile) {
        return profile;
      }

      const fallbackDisplayName =
        typeof user.email === "string" ? user.email : String(user.email || "");

      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        display_name: fallbackDisplayName,
        is_admin: false,
      });

      if (insertError && insertError.code !== "23505") {
        console.warn("No se pudo crear el perfil del usuario", insertError);
      }

      const { data: createdProfile, error: reloadError } = await supabase
        .from("profiles")
        .select("display_name, is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (reloadError && reloadError.code !== "PGRST116") {
        console.warn("No se pudo recargar el perfil del usuario", reloadError);
        return null;
      }

      return createdProfile || null;
    } catch (error) {
      console.warn("No se pudo sincronizar el perfil del usuario", error);
      return null;
    }
  };

  const sessionFromSupabase = async (supabaseSession) => {
    if (!supabaseSession || !supabaseSession.user) {
      return null;
    }

    const { user } = supabaseSession;
    const profile = await fetchOrCreateProfile(user);
    const normalizedEmail = String(user.email || "").trim().toLowerCase();
    const metadataFullName = user.user_metadata && user.user_metadata.full_name;
    const metadataFirstName =
      typeof metadataFullName === "string" && metadataFullName.trim()
        ? metadataFullName.trim().split(/\s+/)[0]
        : null;
    const emailBase = normalizedEmail.includes("@")
      ? normalizedEmail.split("@")[0]
      : normalizedEmail;

    return {
      email: normalizedEmail,
      name:
        (profile && profile.display_name) ||
        metadataFirstName ||
        emailBase ||
        normalizedEmail,
      isAdmin: Boolean(profile && profile.is_admin),
    };
  };

  const loadSessionFromSupabase = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { session: null, error };
      }

      const normalizedSession = await sessionFromSupabase(data && data.session);
      return { session: normalizedSession, error: null };
    } catch (error) {
      return { session: null, error };
    }
  };

  const refreshSessionFromSupabase = async ({ updateUi = true } = {}) => {
    if (!window.supabase || !supabase.auth || typeof supabase.auth.getSession !== "function") {
      return { session: CURRENT_SESSION, changed: false };
    }

    try {
      const { session: supabaseSession, error } = await loadSessionFromSupabase();

      if (error) {
        console.warn("No se pudo obtener la sesión de Supabase", error);
        return { session: CURRENT_SESSION, changed: false };
      }

      const previousSession = CURRENT_SESSION;

      if (!sessionsAreEqual(previousSession, supabaseSession)) {
        setSession(supabaseSession);

        if (updateUi) {
          updateNav();
        }

        return { session: CURRENT_SESSION, changed: true };
      }

      return { session: CURRENT_SESSION, changed: false };
    } catch (error) {
      console.warn("No se pudo obtener la sesión de Supabase", error);
      return { session: CURRENT_SESSION, changed: false };
    }
  };

  const getSession = () => {
    refreshSessionFromSupabase();
    return CURRENT_SESSION;
  };

  const isAdmin = () => {
    const session = getSession();
    return Boolean(session && session.isAdmin);
  };

  const updateNav = () => {
    const adminOnly = document.querySelectorAll("[data-admin-only]");
    const loginLinks = document.querySelectorAll("[data-login-link]");
    const logoutLinks = document.querySelectorAll("[data-logout-link]");
    const adminPills = document.querySelectorAll("[data-admin-pill]");
    const adminNames = document.querySelectorAll("[data-admin-name]");

    const session = getSession();

    adminOnly.forEach((el) => {
      el.classList.toggle("d-none", !(session && session.isAdmin));
    });

    loginLinks.forEach((el) => {
      el.classList.toggle("d-none", Boolean(session));
    });

    logoutLinks.forEach((el) => {
      el.classList.toggle("d-none", !session);
    });

    adminPills.forEach((el) => {
      if (session) {
        el.classList.remove("d-none");
      } else {
        el.classList.add("d-none");
      }
    });

    adminNames.forEach((el) => {
      el.textContent = session ? session.name.split(" ")[0] : "";
    });
  };

  const attemptLogin = async (email, password) => {
    if (!window.supabase || !supabase.auth || typeof supabase.auth.signInWithPassword !== "function") {
      console.warn("Supabase no está disponible para iniciar sesión");
      return null;
    }

    const normalizedEmail = String(email || "").trim();
    const normalizedPassword = typeof password === "string" ? password : String(password || "");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedPassword,
      });

      if (error) {
        console.warn("No se pudo iniciar sesión", error);
        return null;
      }

      const { session, error: sessionError } = await loadSessionFromSupabase();

      if (sessionError) {
        console.warn("No se pudo obtener la sesión tras iniciar sesión", sessionError);
        return null;
      }

      if (!session) {
        console.warn("Supabase no devolvió una sesión válida tras iniciar sesión");
        return null;
      }

      if (!sessionsAreEqual(CURRENT_SESSION, session)) {
        setSession(session);
      }

      updateNav();
      return session;
    } catch (error) {
      console.warn("No se pudo iniciar sesión", error);
      return null;
    }
  };

  const logout = async () => {
    if (window.supabase && supabase.auth && typeof supabase.auth.signOut === "function") {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.warn("No se pudo cerrar sesión en Supabase", error);
      }
    }

    setSession(null);
    updateNav();
  };

  const requireAdminAccess = () => {
    if (isAdmin()) {
      return;
    }

    const pathSegment = window.location.pathname.split('/').pop() || 'index.html';
    const query = window.location.search || '';
    const hash = window.location.hash || '';
    const redirectParam = encodeURIComponent(`${pathSegment}${query}${hash}`);
    window.location.replace(`login.html?redirect=${redirectParam}`);
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateNav();

    document.querySelectorAll("[data-logout-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        logout();

        if (window.location.pathname.includes("cumpleanos") ||
            window.location.pathname.includes("mi-historia") ||
            window.location.pathname.includes("juego")) {
          window.location.href = "index.html";
        }
      });
    });
  });

  window.RGGAuth = {
    reloadAdminDirectory,
    attemptLogin,
    getSession,
    isAdmin,
    logout,
    requireAdminAccess,
    updateNav,
  };
})();
