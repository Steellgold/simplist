type PageHeaderProps = {
  title: string;
  description: string;

  action: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
  
      {action}
    </div>
  );
}