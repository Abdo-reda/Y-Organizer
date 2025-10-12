export enum TauriCommmandsEnum {
    EXPORT_DATABASE = 'export_database',
    IMPORT_DATABASE = 'import_database',
}

export type TauriCommandsDataMap = {
	[TauriCommmandsEnum.EXPORT_DATABASE]: { targetPath: string };
	[TauriCommmandsEnum.IMPORT_DATABASE]: { sourcePath: string };
};