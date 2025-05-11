
import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">CertChain</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#issue" className="hover:text-indigo-200">Issue Certificate</a></li>
            <li><a href="#verify" className="hover:text-indigo-200">Verify Certificate</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}