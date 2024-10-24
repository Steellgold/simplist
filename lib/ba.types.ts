export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | undefined;
  metadata?: unknown;
  members: Member[];
  invitations: Invitation[];
};

export type Member = {
  id: string;
  userId: string;

  name: string;
  email: string;
  image: string;

  createdAt: Date;

  role: "member" | "admin" | "owner";
  organizationId: string;

  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
};

export type Invitation = {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  expiresAt: Date;
};

export type OrganizationList = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string;
  metadata?: unknown;
};