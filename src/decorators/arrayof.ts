import { Field, Type } from 'resting-squirrel';

import BaseDto from '../base.dto';
import typeDecorator from './type';

export default (type: Type.Type | (new () => BaseDto<any>)): PropertyDecorator => {
	const d = (target: any, property: string, descriptor: PropertyDescriptor) => {
		if (Type.isValidType(type)) {
			typeDecorator(Type.arrayOf(type as Type.Type));
		} else {
			if (!target.__shape_arrays__) {
				target.__shape_arrays__ = {};
			}
			target.__shape_arrays__[property] = type;
			if (!target.__properties__) {
				target.__properties__ = [];
			}
			target.__properties__.push(property);
		}
		return descriptor;
	};
	return d as unknown as PropertyDecorator;
};
