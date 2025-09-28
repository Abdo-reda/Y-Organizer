import type { InjectionKey } from 'vue';
import { IStorageService } from '../interfaces/services/IStroageService';

export const StorageServiceKey: InjectionKey<IStorageService> = Symbol();
