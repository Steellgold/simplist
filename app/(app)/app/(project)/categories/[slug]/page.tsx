import type { Component } from "@/components/component";

const Page: Component<{ params: { slug: string } }> = ({ params }) => {
  return (
    <div className="container mx-auto p-4 mt-16">
      <h1>{params.slug}</h1>
    </div>
  );
};

export default Page;