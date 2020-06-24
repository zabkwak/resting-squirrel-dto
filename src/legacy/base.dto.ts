import { Field, FieldShape, FieldShapeArray, Param, ParamShape, ParamShapeArray, Type } from 'resting-squirrel';

import RSDto, { IRSDto } from '../';

import arrayOf from '../decorators/arrayof';
import description from '../decorators/description';
import param from '../decorators/param';
import required from '../decorators/required';
import response from '../decorators/response';
import typeDecorator from '../decorators/type';

export default class BaseDto<FieldType = any> implements IRSDto {

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
	 * Indicates if the property is required. Usable only on parameters.
	 */
	public static required = required;

	/**
	 * Defines the property as parameter.
	 */
	public static param = param;

	/**
	 * Defines the property as response.
	 */
	public static response = response;

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
	public static shape = (shape: new () => IRSDto) => BaseDto.type(shape);

	// #endregion

	public static toArray() {
		return new this().toArray();
	}

	public static toParams(optional: Array<string> = [], omit: Array<string> = []) {
		return new this().toParams(optional, omit);
	}

	public static toResponse(omit: Array<string> = []) {
		return new this().toResponse(omit);
	}

	public toArray(): Array<FieldType> {
		throw new Error('Not implemented');
	}

	public toParams(optional: Array<string> = [], omit: Array<string> = []) {
		return RSDto.toParams(this.constructor as any, optional, omit);
	}

	public toResponse(omit: Array<string> = []): Array<Field | FieldShape | FieldShapeArray> {
		return RSDto.toResponse(this.constructor as any, omit);
	}
}
