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
	__shapes__: { [property: string]: new () => IStore };
	__shape_arrays__: { [property: string]: new () => IStore };
	__types__: { [property: string]: Type.Type };
}

// tslint:disable-next-line: no-empty-interface
export interface IRSDto { }

export default class RSDto {

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
	public static integer = RSDto.type(Type.integer);

	/**
	 * Defines the property as a string.
	 */
	public static string = RSDto.type(Type.string);

	/**
	 * Defines the property as a float.
	 */
	public static float = RSDto.type(Type.float);

	/**
	 * Defines the property as a date.
	 */
	public static date = RSDto.type(Type.date);

	/**
	 * Defines the property as a boolean.
	 */
	public static boolean = RSDto.type(Type.boolean);

	/**
	 * Defines the property as an object.
	 */
	public static object = RSDto.type(Type.object);

	/**
	 * Defines the property as an any.
	 */
	public static any = RSDto.type(Type.any);

	/**
	 * Defines the property as an enum.
	 */
	public static enum = (...values: Array<string>) => RSDto.type(Type.enum_(...values));

	/**
	 * Defines the property as a shape.
	 */
	public static shape = (shape: new () => IRSDto) => RSDto.type(shape);

	// #endregion

	public static toParams(
		Dto: new (...args: any[]) => IRSDto,
		optional: Array<string> = [],
		omit: Array<string> = [],
	): Array<Param | ParamShape | ParamShapeArray> {
		return this._toParams(new Dto() as unknown as IStore, optional, omit);
	}

	public static toResponse(Dto: new (...args: any[]) => IRSDto, omit: Array<string> = []) {
		return this._toResponse(new Dto() as unknown as IStore, omit);
	}

	private static _toParams(
		dto: IStore,
		optional: Array<string> = [],
		omit: Array<string> = [],
	): Array<Param | ParamShape | ParamShapeArray> {
		return this._getProperties(dto)
			.filter((property) => {
				if (this._isPropertyResponse(dto, property) && !this._isPropertyParam(dto, property)) {
					return false;
				}
				return true;
			})
			.map((property) => {
				if (this._isPropertyShape(dto, property)) {
					return new Param.Shape(
						property,
						this._isPropertyRequired(dto, property, optional),
						this._getPropertyDescription(dto, property),
						...this._toParams(
							new (this._getPropertyShape(dto, property))(),
							this._getNestedOptional(property, optional),
						),
					);
				}
				if (this._isPropertyShapeArray(dto, property)) {
					return new Param.ShapeArray(
						property,
						this._isPropertyRequired(dto, property, optional),
						this._getPropertyDescription(dto, property),
						...this._toParams(
							new (this._getPropertyShapeArray(dto, property))(),
							this._getNestedOptional(property, optional),
						),
					);
				}
				return new Param(
					property,
					this._isPropertyRequired(dto, property, optional),
					this._getPropertyType(dto, property),
					this._getPropertyDescription(dto, property),
				);
			});
	}

	private static _toResponse(dto: IStore, omit: Array<string> = []): Array<Field | FieldShape | FieldShapeArray> {
		return this._getProperties(dto)
			.filter((property) => {
				if (this._isPropertyParam(dto, property) && !this._isPropertyResponse(dto, property)) {
					return false;
				}
				return true;
			})
			.map((property) => {
				if (this._isPropertyShape(dto, property)) {
					return new Field.Shape(
						property,
						this._getPropertyDescription(dto, property),
						...this._toResponse(
							new (this._getPropertyShape(dto, property))(),
						),
					);
				}
				if (this._isPropertyShapeArray(dto, property)) {
					return new Field.ShapeArray(
						property,
						this._getPropertyDescription(dto, property),
						...this._toResponse(
							new (this._getPropertyShapeArray(dto, property))(),
						),
					);
				}
				return new Field(
					property,
					this._getPropertyType(dto, property),
					this._getPropertyDescription(dto, property),
				);
			});
	}

	private static _getPropertyDescription(dto: IStore, property: string): string {
		if (dto.__descriptions__) {
			return dto.__descriptions__[property] || '';
		}
		return '';
	}

	private static _getPropertyType(dto: IStore, property: string): Type.Type {
		if (dto.__types__) {
			return dto.__types__[property] || Type.any;
		}
		return Type.any;
	}

	private static _isPropertyShape(dto: IStore, property: string): boolean {
		return Boolean(this._getPropertyShape(dto, property));
	}

	private static _isPropertyShapeArray(dto: IStore, property: string): boolean {
		return Boolean(this._getPropertyShapeArray(dto, property));
	}

	private static _getPropertyShape(dto: IStore, property: string): new () => IStore {
		if (dto.__shapes__) {
			return dto.__shapes__[property];
		}
		return null;
	}

	private static _getPropertyShapeArray(dto: IStore, property: string): new () => IStore {
		if (dto.__shape_arrays__) {
			return dto.__shape_arrays__[property];
		}
		return null;
	}

	private static _isPropertyRequired(dto: IStore, property: string, optional: Array<string> = []): boolean {
		if (optional.includes(property)) {
			return false;
		}
		return (dto.__required__ || []).includes(property);
	}

	private static _isPropertyParam(dto: IStore, property: string): boolean {
		return (dto.__params__ || []).includes(property);
	}

	private static _isPropertyResponse(dto: IStore, property: string): boolean {
		return (dto.__responses__ || []).includes(property);
	}

	private static _getProperties(dto: IStore): Array<string> {
		return [...(dto.__properties__ || []), ...Object.getOwnPropertyNames(dto)]
			.filter((property) => ![
				'__descriptions__', '__properties__', '__types__', '__shapes__', '__shape_arrays__', '__required__', '__params__', '__responses__',
			].includes(property));
	}

	private static _getNestedOptional(property: string, optional: Array<string>): Array<string> {
		return optional
			.map((field) => {
				const firstDot = field.indexOf('.');
				if (firstDot < 0) {
					return null;
				}
				const parent = field.substr(0, firstDot);
				const child = field.substr(firstDot + 1);
				return parent === property ? child : null;
			})
			.filter((field) => Boolean(field));
	}
}
