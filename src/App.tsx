import { useState } from 'react';
import { Layout } from './components/layout/Layout';
// We will import these later as we build them. For now, placeholders.
import { Dashboard } from './components/dashboard/Dashboard';
import { KanbanBoard } from './components/board/KanbanBoard';


import { AuthGate } from './components/auth/AuthGate';

function App() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <AuthGate>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {activeView === "dashboard" ? (
          <Dashboard />
        ) : (
          <KanbanBoard projectId={activeView} />
        )}
      </Layout>
    </AuthGate>
  );
}

export default App;
