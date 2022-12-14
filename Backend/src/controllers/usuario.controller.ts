import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Keys} from '../configuracion/Keys';
import {Credenciales,} from '../models';
import {UsuarioRepository} from '../repositories';
import {AutenticacionService} from '../services';
import { Usuario} from '../models';
const fetch = require("node-fetch");
export class UsuarioController{
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService

  ) { }

  @post('/registrese')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ):  Promise<void> {
    let password = this.servicioAutenticacion.GenerarClave();
    let claveCifrada= this.servicioAutenticacion.Encriptar(password);
    usuario.password=claveCifrada;
    let user= await this.usuarioRepository.create(usuario);

    if(usuario.perfil=="usuario"){
      let p= await this.usuarioRepository.create(usuario);

    }


  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  /**
   * proceso propio de login
   *
   */



  @post('/Identificar-usuario', {
    responses: {
      "200": {
        description: "Identificacion de usuiario"
      }
    }

  })
  async identificarUser(
    @requestBody() credenciales: Credenciales
  ): Promise<Usuario | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        password: credenciales.password
      }
    });
    return usuario

  }
@post('/LoginT')
@response (200,{
  description: "Identificacion del usuario generando token"

})

async identificarToken(
  @requestBody() credendiales: Credenciales
){
  let p= await this.servicioAutenticacion.IdentificarUsuario(credendiales);
  if (p) {
    let token = this.servicioAutenticacion.GeneracionToken(p);
    return {
      respuesta:{
        nombre: p.nombre
     },
     tk: token
    }
  }else{
    throw new HttpErrors[401]("Datos invalidos");
  }
}

@post('/login')
@response(200,{
  description: "Igreso de usuario de la app"
  })

  async identificar(
    @requestBody () credenciales : Credenciales
  ){
  let user= await this.servicioAutenticacion.IdentificarUsuario(credenciales);
  if (user) {
    let token= this.servicioAutenticacion.GeneracionToken(user)
    return {
      info:{
        nombre: user.nombre
      },
      tk: token
    }
  } else {
    throw new HttpErrors [401]("usuario no corresponde invalido");
  }

 }
}
