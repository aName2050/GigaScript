import { DataConstructors, GSAny, GSObject } from '../runtime/types';

export function objectToGSObject(obj: object): GSObject {
	const ObjMap = new Map<string, GSAny>();

	console.log(objectToMap(obj));

	return DataConstructors.OBJECT(ObjMap);
}

function objectToMap(obj: object): Map<string, GSAny | GSObject> {
	const objMap = new Map<string, any>();

	for (const [k, v] of Object.entries(obj)) {
		if (typeof v == 'object') {
			objMap.set(k, objectToMap(v ? Object(v) : {}));
			continue;
		}

		objMap.set(k, v);
	}

	return objMap;
}
