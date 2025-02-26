export type BreadcrumbItem = {
  label: string;
  href?: string;
}

export type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
}