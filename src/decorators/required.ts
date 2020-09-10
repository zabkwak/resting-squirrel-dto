import { IRSDto, IStore } from '..';
import { defineStoreProperty } from '../utils';

export default (target: IRSDto, property: string) => {
	const t = target as unknown as IStore;
	defineStoreProperty(t, '__required__', []);
	t.__required__.push(property);
};
