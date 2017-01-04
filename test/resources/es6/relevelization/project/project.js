import { LoggerContext } from "../logging/logger-context";
import { ParameterContainer } from "../core/parameter-container";
export class Project {
    constructor() {
        this.loggerContext = new LoggerContext();
        this.parameterContainer = new ParameterContainer();
    }
}
