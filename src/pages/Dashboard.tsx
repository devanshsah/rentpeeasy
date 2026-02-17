import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import TenantDashboard from "@/components/dashboard/TenantDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        {user.role === "owner" ? <OwnerDashboard user={user} /> : <TenantDashboard user={user} />}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
