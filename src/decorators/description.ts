import BaseDto, { IStore } from '../base.dto';

export default (description: string) => {
	return (target: BaseDto<any>, property: string) => {
		const t = target as unknown as IStore;
		if (!t.__descriptions__) {
			t.__descriptions__ = {};
		}
		t.__descriptions__[property] = description;
	};
};
