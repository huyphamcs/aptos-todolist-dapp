import { WalletSelector } from "./WalletSelector";
import { ThemeToggle } from "./ui/theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Aptos Todolist
          </h1>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <ThemeToggle />
          <WalletSelector />
        </div>
      </div>
    </header>
  );
}
