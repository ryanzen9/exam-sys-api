import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class DomainsService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
}
