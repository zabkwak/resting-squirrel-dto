const d = (target: any, property: string, descriptor: PropertyDescriptor) => {
	if (!target.__required__) {
		target.__required__ = [];
	}
	target.__required__.push(property);
	return descriptor;
};

export default d as unknown as PropertyDecorator;
