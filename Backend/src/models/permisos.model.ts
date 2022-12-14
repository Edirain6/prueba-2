import {Entity, model, property} from '@loopback/repository';

@model()
export class Permisos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombrePermisos: string;

  @property({
    type: 'string',
  })
  rolesId?: string;

  constructor(data?: Partial<Permisos>) {
    super(data);
  }
}

export interface PermisosRelations {
  // describe navigational properties here
}

export type PermisosWithRelations = Permisos & PermisosRelations;
