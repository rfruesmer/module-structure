export interface StructureMapLanguageProvider {
    /**
     * @public
     * @param {string} modulePath The file path of the current module to provide dependencies for.
     * @param {string} rootPath The root path of the code base. Some external libraries require this.
     * @returns {Array<string>} A list of relative file paths to dependent modules.
     */
    getDependencies(modulePath: string, rootDir: string): Array<string>;
}
