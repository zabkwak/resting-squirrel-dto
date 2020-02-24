import { Field, Type } from 'resting-squirrel';

import BaseDto from '../base.dto';

export default (type: Type.Type | (new () => BaseDto<any>)) => {
	return (target: any, property: string) => {
		if (Type.isValidType(type)) {
			if (!target.__types__) {
				target.__types__ = {};
			}
			target.__types__[property] = type;
		} else {
			if (!target.__shapes__) {
				target.__shapes__ = {};
			}
			target.__shapes__[property] = type;
		}
		if (!target.__properties__) {
			target.__properties__ = [];
		}
		target.__properties__.push(property);
	};
};
