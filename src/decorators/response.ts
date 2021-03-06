import RSDto, { IRSDto, IStore } from '..';
import { defineStoreProperty } from '../utils';

export default (target: IRSDto, property: string) => {
	const t = target as unknown as IStore;
	defineStoreProperty(t, '__responses__', []);
	t.__responses__.push(property);
};
