import { Type } from 'resting-squirrel';

import RSDto, { IRSDto, IStore } from '..';
import { defineStoreProperty } from '../utils';

export default (type: Type.Type | (new () => IRSDto)) => {
	return (target: IRSDto, property: string) => {
		const t = target as unknown as IStore;
		const _type = type;
		if (Type.isValidType(type)) {
			defineStoreProperty(t, '__types__', {});
			t.__types__[property] = _type as Type.Type;
		} else {
			defineStoreProperty(t, '__shapes__', {});
			t.__shapes__[property] = _type as new () => IStore;
		}
		defineStoreProperty(t, '__properties__', []);
		t.__properties__.push(property);
	};
};
