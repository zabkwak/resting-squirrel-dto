import { Param, ParamShape, ParamShapeArray } from 'resting-squirrel';

import Base from './base.dto';

export default class RequestDto extends Base<Param | ParamShape | ParamShapeArray> {

	public static toArray() {
		return new this().toArray();
	}

	public toArray(): Array<Param | ParamShape | ParamShapeArray> {
		return this.toParams();
	}
}
