"use client";

import { useEffect, type ReactElement } from "react";
import { useProjectStore } from "@/store/project.store";

type PageParams = {
  params: {
    id: string;
  };
};

const ProjectHome = ({ params }: PageParams): ReactElement => {
  const { setActive, projects, active } = useProjectStore();

  const { id } = params;

  useEffect(() => {
    setActive(id);
    console.log(id);
  }, [id, setActive]);

  return (
    <div className="p-3">
      <p>
        Here are your project.
      </p>

      <pre>{JSON.stringify(active, null, 2)}</pre>
      <div className="my-20"></div>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </div>
  );
};


export default ProjectHome;