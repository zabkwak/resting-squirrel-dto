import { Field, FieldShape, FieldShapeArray } from 'resting-squirrel';

import Base from './base.dto';

export default class ResponseDto extends Base<Field | FieldShape | FieldShapeArray> {

	public static toArray() {
		return new this().toArray();
	}

	public toArray(): Array<Field | FieldShape | FieldShapeArray> {
		return this.getProperties().map((property) => {
			if (this.isPropertyShape(property)) {
				return new Field.Shape(
					property,
					this.getPropertyDescription(property),
					...(new (this.getPropertyShape(property) as typeof ResponseDto)()).toArray(),
				);
			}
			if (this.isPropertyShapeArray(property)) {
				return new Field.ShapeArray(
					property,
					this.getPropertyDescription(property),
					...(new (this.getPropertyShapeArray(property) as typeof ResponseDto)()).toArray(),
				);
			}
			return new Field(
				property,
				this.getPropertyType(property),
				this.getPropertyDescription(property),
			);
		});
	}
}
