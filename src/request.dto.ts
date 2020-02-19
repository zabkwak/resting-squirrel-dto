import { Param, ParamShape, ParamShapeArray } from 'resting-squirrel';

import Base from './base.dto';
import required from './decorators/required';

export default class RequestDto extends Base<Param | ParamShape | ParamShapeArray> {

	public static required = required;

	public static toArray() {
		return new this().toArray();
	}

	public toArray(): Array<Param | ParamShape | ParamShapeArray> {
		return this.getProperties().map((property) => {
			if (this.isPropertyShape(property)) {
				return new Param.Shape(
					property,
					this.isPropertyRequired(property),
					this.getPropertyDescription(property),
					...(new (this.getPropertyShape(property) as typeof RequestDto)()).toArray(),
				);
			}
			if (this.isPropertyShapeArray(property)) {
				return new Param.ShapeArray(
					property,
					this.isPropertyRequired(property),
					this.getPropertyDescription(property),
					...(new (this.getPropertyShapeArray(property) as typeof RequestDto)()).toArray(),
				);
			}
			return new Param(
				property,
				this.isPropertyRequired(property),
				this.getPropertyType(property),
				this.getPropertyDescription(property),
			);
		});
	}

	protected getProperties(): Array<string> {
		return super.getProperties().filter((property) => !['__required__'].includes(property));
	}

	protected isPropertyRequired(property: string): boolean {
		return (this.__required__ || []).includes(property);
	}
}
