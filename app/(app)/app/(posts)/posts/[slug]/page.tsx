import { Component } from "@/components/component";

type Props = {
  props: {
    slug: string
  }
}

const Page: Component<Props> = ({ props }) => {
  return (
    <div className="container mx-auto p-4 mt-16">
      <h1>{props.slug}</h1>
    </div>
  )
}

export default Page;