export abstract class Dto<ParamType, UnpackReturnType> {
    public abstract unpack(): UnpackReturnType;

    // eslint-disable-next-line
    constructor(params: ParamType) {};
}