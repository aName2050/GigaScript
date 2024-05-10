import { DataConstructors, GSAny, GSObject } from '../runtime/types';

export function objectToGSObject(obj: object): GSObject {
	const ObjMap = objectToMap(obj);

	const gsObj = DataConstructors.OBJECT(ObjMap);

	console.log(gsObj);

	return gsObj;
}

export function objectToMap(
	obj: object,
	visited = new Set<any>()
): Map<string, GSAny | GSObject> {
	const objMap = new Map<string, GSAny | GSObject>();

	if (visited.has(obj)) return objMap;
	visited.add(obj);

	for (const [k, v] of Object.entries(obj)) {
		if (typeof v === 'object' && v !== null) {
			const nestedMap = objectToMap(v, visited);
			objMap.set(k, DataConstructors.OBJECT(nestedMap));
		} else {
			objMap.set(k, v);
		}
	}

	visited.delete(obj);

	return objMap;
}
