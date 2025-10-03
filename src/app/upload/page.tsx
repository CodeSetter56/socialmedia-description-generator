// app/upload/page.tsx

import ImageForm from "./ImageForm";
import InputForm from "./InputForm";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex flex-1 min-h-0 p-8 gap-8 bg-amber-50">
        <div className="w-1/2 h-full overflow-y-auto">
          <ImageForm />
        </div>
        <div className="w-1/2 h-full overflow-y-auto">
          <InputForm />
        </div>
      </main>
    </div>
  );
}
