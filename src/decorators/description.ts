import RSDto, { IRSDto, IStore } from '..';
import { defineStoreProperty } from '../utils';

export default (description: string) => {
	return (target: IRSDto, property: string) => {
		const t = target as unknown as IStore;
		defineStoreProperty(t, '__descriptions__', {});
		t.__descriptions__[property] = description;
	};
};
