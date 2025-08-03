import { Header } from "@/components/Header";

import { TodolistComponent } from "@/components/TodolistComponent";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    
  })
  return (
    <div className="min-h-screen bg-background">
      {/* <TopBanner /> */}
      <Header />
      <main className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 pointer-events-none" />
        
        {/* Content */}
        <div className="relative flex items-start justify-center min-h-[calc(100vh-8rem)] p-6 pt-8">
          <TodolistComponent />
        </div>
      </main>
    </div>
  );
}

export default App;