import ImageForm from "./ImageForm";
import InputForm from "./InputForm";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header
        className="flex items-center justify-center border-b bg-white p-4 shadow-sm"
        style={{ height: "15vh" }}
      >
        <h1 className="text-4xl font-bold text-gray-800">
          Social Media Post Generator
        </h1>
      </header>

      {/* Add min-h-0 here to allow children to shrink properly */}
      <main className="flex flex-1 min-h-0 p-8 gap-8 overflow-hidden">
        <div className="w-1/2 h-full min-h-0 overflow-hidden">
          <ImageForm />
        </div>
        <div className="w-1/2 h-full min-h-0 overflow-hidden">
          <InputForm />
        </div>
      </main>
    </div>
  );
}
