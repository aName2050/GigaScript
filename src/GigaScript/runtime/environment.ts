import { MK_BOOL, MK_NULL, RuntimeVal } from './values';

export function createGlobalScope() {
    const env = new Environment();
    // Global Variables
    env.delcareVar('true', MK_BOOL(true), true);
    env.delcareVar('false', MK_BOOL(false), true);
    env.delcareVar('null', MK_NULL(), true);

    return env;
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor(parentEnv?: Environment) {
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();
    }

    public delcareVar(
        varName: string,
        value: RuntimeVal,
        constant: boolean
    ): RuntimeVal {
        if (this.variables.has(varName))
            throw `Cannot redeclare variable "${varName}".`;

        this.variables.set(varName, value);
        if (constant) {
            this.constants.add(varName);
        }
        return value;
    }

    public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varName);

        if (env.constants.has(varName)) {
            throw `Cannot not reassign "${varName}" because it is a constant.`;
        }

        env.variables.set(varName, value);
        return value;
    }

    public lookupVar(varName: string): RuntimeVal {
        const env = this.resolve(varName);
        return env.variables.get(varName) as RuntimeVal;
    }

    public resolve(varName: string): Environment {
        if (this.variables.has(varName)) return this;
        if (this.parent == undefined)
            throw `Unable to resolve variable "${varName}" as it does not exist.`;

        return this.parent.resolve(varName);
    }
}
