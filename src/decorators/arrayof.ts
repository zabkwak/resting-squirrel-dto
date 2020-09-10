import { Field, Type } from 'resting-squirrel';

import RSDto, { IRSDto, IStore } from '..';
import { defineStoreProperty } from '../utils';
import typeDecorator from './type';

export default (type: Type.Type | (new () => IRSDto)) => {
	return (target: any, property: string) => {
		if (Type.isValidType(type)) {
			typeDecorator(Type.arrayOf(type as Type.Type))(target, property);
		} else {
			const t = target as unknown as IStore;
			defineStoreProperty(t, '__shape_arrays__', {});
			const _type = type;
			t.__shape_arrays__[property] = _type as new () => IStore;
			defineStoreProperty(t, '__properties__', []);
			target.__properties__.push(property);
		}
	};
};
