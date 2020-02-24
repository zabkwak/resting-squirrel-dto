export default (description: string) => {
	return (target: any, property: string) => {
		if (!target.__descriptions__) {
			target.__descriptions__ = {};
		}
		target.__descriptions__[property] = description;
	};
};
