export default (target: any, property: string) => {
	if (!target.__required__) {
		target.__required__ = [];
	}
	target.__required__.push(property);
};
