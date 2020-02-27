import { Field, FieldShape, FieldShapeArray, Param, ParamShape, ParamShapeArray, Type } from 'resting-squirrel';

import arrayOf from './decorators/arrayof';
import description from './decorators/description';
import param from './decorators/param';
import required from './decorators/required';
import response from './decorators/response';
import typeDecorator from './decorators/type';

export interface IStore {
	__properties__: Array<string>;
	__params__: Array<string>;
	__responses__: Array<string>;
	__required__: Array<string>;
	__descriptions__: { [property: string]: string };
	__shapes__: { [property: string]: new () => BaseDto<any> };
	__shape_arrays__: { [property: string]: new () => BaseDto<any> };
	__types__: { [property: string]: Type.Type };
}

export default class BaseDto<FieldType = any> {

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
	public static shape = (shape: new () => BaseDto<any>) => BaseDto.type(shape);

	// #endregion

	public static toArray() {
		return new this().toArray();
	}

	public static toParams() {
		return new this().toParams();
	}

	public static toResponse() {
		return new this().toResponse();
	}

	// Hack for decorators underline properties.
	[x: string]: any;

	public toArray(): Array<FieldType> {
		throw new Error('Not implemented');
	}

	public toParams(): Array<Param | ParamShape | ParamShapeArray> {
		return this.getProperties()
			.filter((property) => {
				if (this.isPropertyResponse(property) && !this.isPropertyParam(property)) {
					return false;
				}
				return true;
			})
			.map((property) => {
				if (this.isPropertyShape(property)) {
					return new Param.Shape(
						property,
						this.isPropertyRequired(property),
						this.getPropertyDescription(property),
						...(new (this.getPropertyShape(property) as typeof BaseDto)()).toParams(),
					);
				}
				if (this.isPropertyShapeArray(property)) {
					return new Param.ShapeArray(
						property,
						this.isPropertyRequired(property),
						this.getPropertyDescription(property),
						...(new (this.getPropertyShapeArray(property) as typeof BaseDto)()).toParams(),
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

	public toResponse(): Array<Field | FieldShape | FieldShapeArray> {
		return this.getProperties()
			.filter((property) => {
				if (this.isPropertyParam(property) && !this.isPropertyResponse(property)) {
					return false;
				}
				return true;
			})
			.map((property) => {
				if (this.isPropertyShape(property)) {
					return new Field.Shape(
						property,
						this.getPropertyDescription(property),
						...(new (this.getPropertyShape(property) as typeof BaseDto)()).toResponse(),
					);
				}
				if (this.isPropertyShapeArray(property)) {
					return new Field.ShapeArray(
						property,
						this.getPropertyDescription(property),
						...(new (this.getPropertyShapeArray(property) as typeof BaseDto)()).toResponse(),
					);
				}
				return new Field(
					property,
					this.getPropertyType(property),
					this.getPropertyDescription(property),
				);
			});
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

	protected isPropertyRequired(property: string): boolean {
		return (this.__required__ || []).includes(property);
	}

	protected isPropertyParam(property: string): boolean {
		return (this.__params__ || []).includes(property);
	}

	protected isPropertyResponse(property: string): boolean {
		return (this.__responses__ || []).includes(property);
	}

	protected getProperties(): Array<string> {
		return [...(this.__properties__ || []), ...Object.getOwnPropertyNames(this)]
			.filter((property) => ![
				'__descriptions__', '__properties__', '__types__', '__shapes__', '__shape_arrays__', '__required__', '__params__', '__responses__',
			].includes(property));
	}
}
