import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import TenantDashboard from "@/components/dashboard/TenantDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const renderDashboard = () => {
    switch (user.role) {
      case "admin": return <AdminDashboard user={user} />;
      case "owner": return <OwnerDashboard user={user} />;
      default: return <TenantDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
