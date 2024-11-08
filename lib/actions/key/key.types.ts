export type GetKeyType = {
  organizationId: string;
  memberId: string;

  key: string;

  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;

  active: boolean;

  name: string;
  note: string;

  LinkingKey: string;
};

export type CreateKeyType = {
  name: string;
  note: string;
  expiresAt: string;
};

export type InvalidateKeyType = {
  key: string;
  secuValue: string;
};