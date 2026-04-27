import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { initTheme } from "./hooks/useTheme";

// Initialize theme before first render
initTheme();

// Lazy-loaded pages
const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const AuthPage = lazy(() =>
  import("./pages/AuthPage").then((m) => ({ default: m.AuthPage })),
);
const NgoDashboardPage = lazy(() =>
  import("./pages/NgoDashboardPage").then((m) => ({
    default: m.NgoDashboardPage,
  })),
);
const VolunteerDashboardPage = lazy(() =>
  import("./pages/VolunteerDashboardPage").then((m) => ({
    default: m.VolunteerDashboardPage,
  })),
);
const RequestFormPage = lazy(() =>
  import("./pages/RequestFormPage").then((m) => ({
    default: m.RequestFormPage,
  })),
);
const MapPage = lazy(() =>
  import("./pages/MapPage").then((m) => ({ default: m.MapPage })),
);
const UserProfilePage = lazy(() =>
  import("./pages/UserProfilePage").then((m) => ({
    default: m.UserProfilePage,
  })),
);

function PageSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

// Root route with Layout wrapper
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: () => <AuthPage />,
});

const ngoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo",
  component: () => <NgoDashboardPage />,
});

const volunteerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/volunteer",
  component: () => <VolunteerDashboardPage />,
});

const requestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/request",
  component: () => <RequestFormPage />,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: () => <MapPage />,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <UserProfilePage />,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  authRoute,
  ngoRoute,
  volunteerRoute,
  requestRoute,
  mapRoute,
  profileRoute,
  chatRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
