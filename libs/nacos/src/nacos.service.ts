import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Instance, NacosConfigClient, NacosNamingClient } from 'nacos';

@Injectable()
export class NacosService implements OnModuleInit {
  @Inject('NACOS_REGISTRY') private readonly registryClient: NacosNamingClient;

  @Inject('NACOS_CONFIG') private readonly configClient: NacosConfigClient;

  async onModuleInit() {
    await this.registryClient.ready();
  }

  registry(serverName: string, instance: Instance, group?: string) {
    return this.registryClient.registerInstance(serverName, instance, group);
  }

  deregisterInstance(serverName: string, instance: Instance, group?: string) {
    return this.registryClient.deregisterInstance(serverName, instance, group);
  }

  getAllInstances(serverName: string, group?: string) {
    return this.registryClient.getAllInstances(serverName, group);
  }

  getConfig(dataId: string, group: string) {
    return this.configClient.getConfig(dataId, group);
  }

  publishConfig(dataId: string, group: string, content: string) {
    return this.configClient.publishSingle(dataId, group, content);
  }

  removeConfig(dataId: string, group: string) {
    return this.configClient.remove(dataId, group);
  }

  subscribeConfig(
    dataId: string,
    group: string,
    listener: (content: string) => void,
  ) {
    return this.configClient.subscribe({ dataId, group }, listener);
  }

  unsubscribeConfig(
    dataId: string,
    group: string,
    listener: (content: string) => void,
  ) {
    return this.configClient.unSubscribe({ dataId, group }, listener);
  }
}
