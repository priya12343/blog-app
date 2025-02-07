import BlogList from "@/app/components/blogList";

export default function Home() {
  return (
    <main>
      <h1 className="tw-text-center tw-text-2xl tw-font-bold tw-mb-4">Blog Posts</h1>
      <BlogList />
    </main>
  );
}
