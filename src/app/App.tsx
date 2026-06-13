// import { useEffect, useState } from 'react';
// import Landing from './pages/Landing';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import AppLayout from './pages/app/Layout';
// import { useAuth } from './context/AuthContext.tsx';

// type Page = 'landing' | 'signup' | 'login' | 'app';

// export default function App() {
//   const [currentPage, setCurrentPage] = useState<Page>(() => {
//     return localStorage.getItem('token') ? 'app' : 'landing';
//   });
//   const { isAuthenticated, loading, logout } = useAuth();

//   // Force dark mode
//   useEffect(() => {
//     document.documentElement.classList.add('dark');
//   }, []);

//   useEffect(() => {
//     if (!loading && isAuthenticated && currentPage !== 'app') {
//       setCurrentPage('app');
//     }

//     if (!loading && !isAuthenticated && currentPage === 'app') {
//       setCurrentPage('landing');
//     }
//   }, [currentPage, isAuthenticated, loading]);

//   useEffect(() => {
//     console.log('App state:', { currentPage, isAuthenticated, loading });
//   }, [currentPage, isAuthenticated, loading]);

//   const handleNavigate = (page: Page) => {
//     setCurrentPage(page);
//   };

//   const handleLogin = () => {
//     setCurrentPage('app');
//   };

//   const handleLogout = () => {
//     logout();
//     setCurrentPage('landing');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
//         Restoring session...
//       </div>
//     );
//   }

//   if (currentPage === 'landing') {
//     return <Landing onNavigate={handleNavigate} />;
//   }

//   if (currentPage === 'signup') {
//     return <Signup onNavigate={handleNavigate} onSignup={handleLogin} />;
//   }

//   if (currentPage === 'login') {
//     return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
//   }

//   if (currentPage === 'app' && isAuthenticated) {
//     return <AppLayout onLogout={handleLogout} />;
//   }

//   return <Landing onNavigate={handleNavigate} />;
// }







import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AppLayout from "./pages/app/Layout";
import VideoCallid from "./pages/app/videocallid/page";
import { useAuth } from "./context/AuthContext";

type Page =
  | "landing"
  | "signup"
  | "login"
  | "app"
  | "videocall";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return localStorage.getItem("token") ? "app" : "landing";
  });

  const { isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated && currentPage !== "app") {
      setCurrentPage("app");
    }

    if (!loading && !isAuthenticated) {
      setCurrentPage("landing");
    }
  }, [isAuthenticated, loading]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setCurrentPage("app");
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("landing");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Restoring session...
      </div>
    );
  }

  switch (currentPage) {
    case "landing":
      return <Landing onNavigate={handleNavigate} />;

    case "signup":
      return (
        <Signup
          onNavigate={handleNavigate}
          onSignup={handleLogin}
        />
      );

    case "login":
      return (
        <Login
          onNavigate={handleNavigate}
          onLogin={handleLogin}
        />
      );

    case "videocall":
      return (
        <VideoCallid
          onBack={() => setCurrentPage("app")}
        />
      );

    case "app":
      return (
        <AppLayout
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    default:
      return <Landing onNavigate={handleNavigate} />;
  }
}