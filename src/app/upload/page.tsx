// app/upload/page.tsx

import ImageForm from "./ImageForm";
import InputForm from "./InputForm";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex flex-col md:flex-row flex-1 min-h-0 p-4 md:p-8 gap-4 md:gap-8 bg-amber-50">
        <div className="w-full md:w-1/2 h-auto md:h-full overflow-y-auto">
          <ImageForm />
        </div>
        <div className="w-full md:w-1/2 h-auto md:h-full overflow-y-auto">
          <InputForm />
        </div>
      </main>
    </div>
  );
}
