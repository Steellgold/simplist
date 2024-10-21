import type { Component } from "@/components/component";

type Props = {
  params: {
    slug: string
  }
}

const Page: Component<Props> = ({ params }) => {
  return (
    <div className="container mx-auto p-4 mt-16">
      <h1>{params.slug}</h1>
    </div>
  );
};

export default Page;