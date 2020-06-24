import RSDto, { IRSDto, IStore } from '..';

export default (target: IRSDto, property: string) => {
	const t = target as unknown as IStore;
	if (!t.__required__) {
		t.__required__ = [];
	}
	t.__required__.push(property);
};
