import { Param, ParamShape, ParamShapeArray } from 'resting-squirrel';

import Base from './base.dto';

export default class RequestDto extends Base<Param | ParamShape | ParamShapeArray> {

	public static toArray(optional: Array<string> = [], omit: Array<string> = []) {
		return new this().toArray(optional, omit);
	}

	public toArray(optional: Array<string> = [], omit: Array<string> = []): Array<Param | ParamShape | ParamShapeArray> {
		return this.toParams(optional, omit);
	}
}
