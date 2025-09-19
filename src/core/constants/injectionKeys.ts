import type { InjectionKey } from 'vue';
import { IStorageService } from '../interfaces/services/stroageServiceInterface';

export const StorageServiceKey: InjectionKey<IStorageService> = Symbol();
