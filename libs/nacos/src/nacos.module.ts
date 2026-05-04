import { Module } from '@nestjs/common';
import 'dotenv/config';
import * as Nacos from 'nacos';
import { NacosService } from './nacos.service';

@Module({
  providers: [
    {
      provide: 'NACOS_REGISTRY',
      useFactory: () => {
        const client = new Nacos.NacosNamingClient({
          serverList: process.env.NACOS_SERVER_ADDR || 'localhost:8848',
          namespace: process.env.NACOS_NAMESPACE || 'public',
          logger: console,
        });

        return client;
      },
    },
    {
      provide: 'NACOS_CONFIG',
      useFactory: () => {
        const client = new Nacos.NacosConfigClient({
          serverAddr: process.env.NACOS_SERVER_ADDR || 'localhost:8848',
          namespace: process.env.NACOS_NAMESPACE || 'public',
        });

        return client;
      },
    },
    NacosService,
  ],
  exports: [NacosService],
})
export class NacosModule {}
