import BaseDto, { IStore } from '../base.dto';

export default (target: BaseDto<any>, property: string) => {
	const t = target as unknown as IStore;
	if (!t.__required__) {
		t.__required__ = [];
	}
	t.__required__.push(property);
};
