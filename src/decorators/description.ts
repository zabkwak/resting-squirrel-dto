export default (description: string): PropertyDecorator => {
	const d = (target: any, property: string, descriptor: PropertyDescriptor) => {
		if (!target.__descriptions__) {
			target.__descriptions__ = {};
		}
		target.__descriptions__[property] = description;
		return descriptor;
	};
	return d as unknown as PropertyDecorator;
};
