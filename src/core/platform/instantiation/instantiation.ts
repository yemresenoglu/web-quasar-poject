/**
 * Dependency Injection System (Inspired by VS Code)
 */

export interface ServiceIdentifier<T> {
  readonly _serviceBrand: undefined;
}

export interface ServiceConstructor<T> {
  new (...args: any[]): T;
}

export const createDecorator = <T>(serviceId: string): ServiceIdentifier<T> => {
  return {
    _serviceBrand: undefined
  } as ServiceIdentifier<T>;
};

export class InstantiationService {
  private readonly _services = new Map<ServiceIdentifier<any>, any>();
  private readonly _serviceConstructors = new Map<ServiceIdentifier<any>, ServiceConstructor<any>>();

  registerService<T>(id: ServiceIdentifier<T>, ctor: ServiceConstructor<T>): void {
    this._serviceConstructors.set(id, ctor);
  }

  getService<T>(id: ServiceIdentifier<T>): T {
    if (this._services.has(id)) {
      return this._services.get(id);
    }

    const ctor = this._serviceConstructors.get(id);
    if (!ctor) {
      throw new Error(`Service ${id} not found`);
    }

    const instance = new ctor();
    this._services.set(id, instance);
    return instance;
  }

  createInstance<T>(ctor: ServiceConstructor<T>, ...args: any[]): T {
    return new ctor(...args);
  }
}

export const instantiationService = new InstantiationService(); 