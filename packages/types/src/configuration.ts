import { Template } from './template';

export type Configuration = Omit<Template, 'status' | 'createdBy' | 'updatedBy'> & {
  createdBy?: string; // optional for anonymous users
  templateId: string; // which template it was based on
};
