import { Field, Type } from 'resting-squirrel';

import arrayOf from './decorators/arrayof';
import description from './decorators/description';
import typeDecorator from './decorators/type';

export interface IStore {

}

export default class BaseDto<FieldType> {

	// #region Decorators
	/**
	 * Defines the property as a type or DTO class as Shape.
	 */
	public static type = typeDecorator;

	/**
	 * Defines the property as an array of type or DTO class as ShapeArray.
	 */
	public static arrayOf = arrayOf;

	/**
	 * Defines the description to the property.
	 */
	public static description = description;

	/**
	 * Defines the property as an integer.
	 */
	public static integer = BaseDto.type(Type.integer);

	/**
	 * Defines the property as a string.
	 */
	public static string = BaseDto.type(Type.string);

	/**
	 * Defines the property as a float.
	 */
	public static float = BaseDto.type(Type.float);

	/**
	 * Defines the property as a date.
	 */
	public static date = BaseDto.type(Type.date);

	/**
	 * Defines the property as a boolean.
	 */
	public static boolean = BaseDto.type(Type.boolean);

	/**
	 * Defines the property as an object.
	 */
	public static object = BaseDto.type(Type.object);

	/**
	 * Defines the property as an any.
	 */
	public static any = BaseDto.type(Type.any);

	/**
	 * Defines the property as an enum.
	 */
	public static enum = (...values: Array<string>) => BaseDto.type(Type.enum_(...values));

	/**
	 * Defines the property as a shape.
	 */
	public static shape = (shape: new () => BaseDto<any>) => BaseDto.type(shape);

	// #endregion

	public static toArray() {
		return new this().toArray();
	}

	// Hack for decorators underline properties.
	[x: string]: any;

	public toArray(): Array<FieldType> {
		throw new Error('Not implemented');
	}

	protected getPropertyDescription(property: string): string {
		if (this.__descriptions__) {
			return this.__descriptions__[property] || '';
		}
		return '';
	}

	protected getPropertyType(property: string): Type.Type {
		if (this.__types__) {
			return this.__types__[property] || Type.any;
		}
		return Type.any;
	}

	protected getPropertyShape(property: string): new () => BaseDto<FieldType> {
		if (this.__shapes__) {
			return this.__shapes__[property];
		}
		return null;
	}

	protected getPropertyShapeArray(property: string): new () => BaseDto<Field> {
		if (this.__shape_arrays__) {
			return this.__shape_arrays__[property];
		}
		return null;
	}

	protected isPropertyShape(property: string): boolean {
		return Boolean(this.getPropertyShape(property));
	}

	protected isPropertyShapeArray(property: string): boolean {
		return Boolean(this.getPropertyShapeArray(property));
	}

	protected getProperties(): Array<string> {
		return [...(this.__properties__ || []), ...Object.getOwnPropertyNames(this)]
			.filter((property) => ![
				'__descriptions__', '__properties__', '__types__', '__shapes__', '__shape_arrays__',
			].includes(property));
	}
}
