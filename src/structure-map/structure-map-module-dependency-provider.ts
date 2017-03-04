export interface StructureMapDependencyProvider {
    getDependencies(modulePath: string, rootDir: string): Array<string>;
}
