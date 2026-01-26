import { UseEffectComponent } from "../components/UseEffectComponent";
import { UseMemoComponent } from "../components/UseMemoComponent";
import { UseQueryComponent } from "../components/UseQueryComponent";
import { UseRefComponent } from "../components/UseRefComponent";
import { UseStateComponent } from "../components/UseStateComponent";

export function LearningPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Learning</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UseStateComponent />
        <UseEffectComponent />
        <UseMemoComponent />
        <UseRefComponent />
        <UseQueryComponent />
      </div>
    </div>
  );
}
