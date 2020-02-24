import { Field, Type } from 'resting-squirrel';

import BaseDto from '../base.dto';
import typeDecorator from './type';

export default (type: Type.Type | (new () => BaseDto<any>)) => {
	return (target: any, property: string) => {
		if (Type.isValidType(type)) {
			typeDecorator(Type.arrayOf(type as Type.Type))(target, property);
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
	};
};
