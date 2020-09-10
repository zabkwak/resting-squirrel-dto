import { IStore } from './';

export const defineStoreProperty = <K extends keyof IStore>(target: IStore, name: K, value: any) => {
	if (!target.hasOwnProperty(name)) {
		Object.defineProperty(target, name, {
			enumerable: false,
			value,
			writable: true,
		});
	}
};

export const getStoreArrayProperty = <K extends keyof IStore, T = any>(target: IStore, name: K): T[] => {
	const Parent = Object.getPrototypeOf(target.constructor);
	const parentArray: T[] = [];
	if (Parent.name) {
		parentArray.push(...getStoreArrayProperty(new Parent(), name));
	}
	const a: T[] = target[name] as unknown as T[] || [];
	return [...parentArray, ...a].filter((value, index, self) => self.indexOf(value) === index);
};

export const getStoreMapProperty = <K extends keyof IStore, T = any>(target: IStore, name: K): { [key: string]: T } => {
	const Parent = Object.getPrototypeOf(target.constructor);
	let parentMap: { [key: string]: T };
	if (Parent.name) {
		parentMap = getStoreMapProperty(new Parent(), name);
	}
	const m: { [key: string]: T } = target[name] as unknown as { [key: string]: T };
	if (!parentMap && !m) {
		return null;
	}
	return { ...(parentMap || {}), ...(m || {}) };
};
