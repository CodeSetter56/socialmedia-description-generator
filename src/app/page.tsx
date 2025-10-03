import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="h-full flex flex-col bg-amber-50">
      <main className="flex flex-col items-center justify-center text-center flex-1 px-6">
        <h1 className="text-4xl text-amber-900 md:text-6xl font-semibold mb-6 leading-tight">
          Social Media <br /> Post Generator
        </h1>
        <p className="max-w-xl text-sm md:text-base mb-8 text-gray-700">
          Discover a professional tool designed to help you generate post
          descriptions and hashtags that best fit the platform algorithm quickly
          and effortlessly—perfect for daily users, busy marketers and content
          creators.
        </p>

        <Button href="/upload">
          Get Started
        </Button>
      </main>
    </div>
  );
}
