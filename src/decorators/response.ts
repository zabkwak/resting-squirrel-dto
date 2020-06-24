import RSDto, { IRSDto, IStore } from '..';

export default (target: IRSDto, property: string) => {
	const t = target as unknown as IStore;
	if (!t.__responses__) {
		t.__responses__ = [];
	}
	t.__responses__.push(property);
};
