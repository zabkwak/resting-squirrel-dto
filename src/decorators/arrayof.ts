import { Field, Type } from 'resting-squirrel';

import BaseDto, { IStore } from '../base.dto';
import typeDecorator from './type';

export default (type: Type.Type | (new () => BaseDto<any>)) => {
	return (target: any, property: string) => {
		if (Type.isValidType(type)) {
			typeDecorator(Type.arrayOf(type as Type.Type))(target, property);
		} else {
			const t = target as unknown as IStore;
			if (!t.__shape_arrays__) {
				t.__shape_arrays__ = {};
			}
			const _type = type;
			t.__shape_arrays__[property] = _type as new () => BaseDto<any>;
			if (!t.__properties__) {
				t.__properties__ = [];
			}
			target.__properties__.push(property);
		}
	};
};
