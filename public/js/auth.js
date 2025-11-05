(function () {
  const DEFAULT_ADMIN_USERS = {
    "romina.gutierrez@atelier.com": {
      password: "atelier2024",
      name: "Romina Gutiérrez",
    },
    "isaac.gutierrez@atelier.com": {
      password: "tequiero",
      name: "Isaac Gutiérrez",
    },
  };

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

  const getSession = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("No se pudo recuperar la sesión", error);
      return null;
    }
  };

  const setSession = (session) => {
    if (!session) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const isAdmin = () => Boolean(getSession());

  const updateNav = () => {
    const adminOnly = document.querySelectorAll("[data-admin-only]");
    const loginLinks = document.querySelectorAll("[data-login-link]");
    const logoutLinks = document.querySelectorAll("[data-logout-link]");
    const adminPills = document.querySelectorAll("[data-admin-pill]");
    const adminNames = document.querySelectorAll("[data-admin-name]");

    const session = getSession();

    adminOnly.forEach((el) => {
      el.classList.toggle("d-none", !session);
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

  const attemptLogin = (email, password) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = ADMIN_USERS[normalizedEmail];

    if (!user || user.password !== String(password)) {
      return null;
    }

    const session = {
      email: normalizedEmail,
      name: user.name,
      loginAt: Date.now(),
    };

    setSession(session);
    updateNav();
    return session;
  };

  const logout = () => {
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
