import { Field, FieldShape, FieldShapeArray } from 'resting-squirrel';

import Base from './base.dto';

export default class ResponseDto extends Base<Field | FieldShape | FieldShapeArray> {

	public static toArray() {
		return new this().toArray();
	}

	public toArray(): Array<Field | FieldShape | FieldShapeArray> {
		return this.toResponse();
	}
}
