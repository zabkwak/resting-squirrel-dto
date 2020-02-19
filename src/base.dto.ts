import { Field, Type } from 'resting-squirrel';

import arrayOf from './decorators/arrayof';
import description from './decorators/description';
import typeDecorator from './decorators/type';

export default class BaseDto<FieldType> {

	public static type = typeDecorator;

	public static arrayOf = arrayOf;

	public static description = description;

	public static integer = BaseDto.type(Type.integer);

	public static string = BaseDto.type(Type.string);

	public static float = BaseDto.type(Type.float);

	public static date = BaseDto.type(Type.date);

	public static boolean = BaseDto.type(Type.boolean);

	public static any = BaseDto.type(Type.any);

	public static enum = (...values: Array<string>) => BaseDto.type(Type.enum_(...values));

	public static shape = (shape: new () => BaseDto<any>) => BaseDto.type(shape);

	public static toArray() {
		return new this().toArray();
	}
	// Hack for decorators underline properties.
	[x: string]: any;

	public toArray(): Array<FieldType> {
		throw new Error('Not implemented');
	}

	public getPropertyDescription(property: string): string {
		if (this.__descriptions__) {
			return this.__descriptions__[property] || '';
		}
		return '';
	}

	public getPropertyType(property: string): Type.Type {
		if (this.__types__) {
			return this.__types__[property] || Type.any;
		}
		return Type.any;
	}

	public getPropertyShape(property: string): new () => BaseDto<FieldType> {
		if (this.__shapes__) {
			return this.__shapes__[property];
		}
		return null;
	}

	public getPropertyShapeArray(property: string): new () => BaseDto<Field> {
		if (this.__shape_arrays__) {
			return this.__shape_arrays__[property];
		}
		return null;
	}

	public isPropertyShape(property: string): boolean {
		return Boolean(this.getPropertyShape(property));
	}

	public isPropertyShapeArray(property: string): boolean {
		return Boolean(this.getPropertyShapeArray(property));
	}

	public getProperties(): Array<string> {
		return [...(this.__properties__ || []), ...Object.getOwnPropertyNames(this)]
			.filter((property) => ![
				'__descriptions__', '__properties__', '__types__', '__shapes__', '__shape_arrays__',
			].includes(property));
	}
}
