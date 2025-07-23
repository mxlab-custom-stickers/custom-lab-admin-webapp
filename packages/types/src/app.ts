export interface App {
  id: string;
  name: string;
  icon?: string;

  ownerId: string;
  createdAt: string;

  memberships?: Membership[];
}

export interface Membership {
  userId: string;
  role: Role;
  addedAt: string;
}

export type Role = 'admin' | 'editor' | 'viewer';

export const roleLabels: Record<Role, string> = {
  admin: 'Administrateur',
  editor: 'Éditeur',
  viewer: 'Lecteur',
};
