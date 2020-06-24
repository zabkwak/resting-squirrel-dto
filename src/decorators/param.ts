import RSDto, { IRSDto, IStore } from '..';

export default (target: IRSDto, property: string) => {
	const t = target as unknown as IStore;
	if (!t.__params__) {
		t.__params__ = [];
	}
	t.__params__.push(property);
};
