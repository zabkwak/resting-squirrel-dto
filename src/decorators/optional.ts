import { IRSDto, IStore } from '..';
import { defineStoreProperty } from '../utils';

export default (target: IRSDto, property: string) => {
	const t = target as unknown as IStore;
	defineStoreProperty(t, '__optional__', []);
	t.__optional__.push(property);
};
