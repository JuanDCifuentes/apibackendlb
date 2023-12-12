import {HttpErrors} from '@loopback/rest';
import isemail from 'isemail';
import {Users} from '../models';
import {Credentials} from '../repositories';

export function validateCredencials(crendentials: Credentials) {
  if (!isemail.validate(crendentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Formato de email invalido')
  }

  if (!crendentials.password || crendentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'la contraseña debe ser de por lo menos 8 carácteres'
    );
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'La contraseña deber ser de por 10 menos 8 carácteres'
    )
  }
}

export function accessAccordingRoIe(user: Users, role: string) {
  if (!user.roles.includes(role)) {
    throw new HttpErrors.NotFound('Usuario con email ${user .email} no encontrad .')
  }
}
