import { Type } from 'resting-squirrel';

import BaseDto, { IStore } from '../base.dto';

export default (type: Type.Type | (new () => BaseDto<any>)) => {
	return (target: BaseDto<any>, property: string) => {
		const t = target as unknown as IStore;
		const _type = type;
		if (Type.isValidType(type)) {
			if (!t.__types__) {
				t.__types__ = {};
			}
			t.__types__[property] = _type as Type.Type;;
		} else {
			if (!t.__shapes__) {
				t.__shapes__ = {};
			}
			t.__shapes__[property] = _type as new () => BaseDto<any>;
		}
		if (!t.__properties__) {
			t.__properties__ = [];
		}
		t.__properties__.push(property);
	};
};
