import {PackageTreeEntity} from "../package-tree/package-tree-entity";

export interface StructureMapEntity {
    name: string;
    simpleName: string;
    dependencies: Array<PackageTreeEntity>;
}
