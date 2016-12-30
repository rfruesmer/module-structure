import {PackageTreeEntity} from "../package-tree/package-tree-entity";
import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapPackage} from "./structure-map-package";
import {Package} from "../package-tree/package";
import {StructureMapModule} from "./structure-map-module";
import {Module} from "../package-tree/module";

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;


export class StructureMapEntityFactory {

    public static createFrom(packageTreeEntity: PackageTreeEntity): StructureMapEntity {
        if (packageTreeEntity instanceof Package) {
            return new StructureMapPackage(packageTreeEntity);
        }
        else if (packageTreeEntity instanceof Module) {
            return new StructureMapModule(packageTreeEntity);
        }

        checkState(false, "Unknown entity type");

        return null; // will never reach here, but this return statment makes our compiler happy
    }
}
