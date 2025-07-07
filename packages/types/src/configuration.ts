import { Template } from './template';

export interface Configuration {
  id: string;

  template: Template;

  createdAt: string;
  updatedAt?: string;
}
