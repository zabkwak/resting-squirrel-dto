import RSDto, { IRSDto, IStore } from '..';

export default (description: string) => {
	return (target: IRSDto, property: string) => {
		const t = target as unknown as IStore;
		if (!t.__descriptions__) {
			t.__descriptions__ = {};
		}
		t.__descriptions__[property] = description;
	};
};
