/// <reference no-default-lib="true"/>
/// <reference types="@rbxts/types"/>

/** Placeholder that sometimes helps force TS to display what you want it to. */
type _<T> = T;

/** Make all properties in T optional */
type Partial<T> = { [P in keyof T]?: T[P] };

/** Make all properties in T required */
type Required<T> = { [P in keyof T]-?: T[P] };

/** Make all properties in T readonly */
type Readonly<T> = { readonly [P in keyof T]: T[P] };

/** From T, pick a set of properties whose keys are in the union K */
type Pick<T, K extends keyof T> = { [P in K]: T[P] };

/** Construct a type with a set of properties K of type T */
type Record<K extends keyof any, T> = { [P in K]: T };

/** Make all properties in T non-readonly. */
type Writable<T> = { -readonly [P in keyof T]: T[P] };

/** Exclude from T those types that are assignable to U */
type Exclude<T, U> = T extends U ? never : T;

/** Extract from T those types that are assignable to U */
type Extract<T, U> = T extends U ? T : never;

/** Construct a type with the properties of T except for those in type K. */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/** Exclude null and undefined from T */
type NonNullable<T> = T & {};

/** Obtain the parameters of a function type in a tuple */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/** Obtain the parameters of a constructor function type in a tuple */
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
	...args: infer P
) => any
	? P
	: never;

/** Obtain the return type of a function type */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

/** Obtain the return type of a constructor function type */
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R
	? R
	: any;

/** Returns a union of all the keys of T whose values extend from U */
type ExtractKeys<T, U> = { [K in keyof T]-?: T[K] extends U ? K : never }[keyof T];

/** Returns a new object type of all the keys of T whose values extend from U */
type ExtractMembers<T, U> = Pick<T, ExtractKeys<T, U>>;

/** Returns a union of all the keys of T whose values do not extend from U */
type ExcludeKeys<T, U> = { [K in keyof T]-?: T[K] extends U ? never : K }[keyof T];

/** Returns a new object type of all the keys of T whose values do not extend from U */
type ExcludeMembers<T, U> = Pick<T, ExcludeKeys<T, U>>;

/** Returns the type of `this` for a given function type */
type InferThis<T> = T extends (this: infer U, ...args: any) => any ? U : never;

/** Combines a series of intersections into one object, e.g. { x: number } & { y: number } becomes { x: number, y: number } */
type Reconstruct<T> = _<{ [K in keyof T]: T[K] }>;

/** Converts a series of object unions to a series of intersections, e.g. A | B becomes A & B */
type UnionToIntersection<T> = (T extends object ? (k: T) => void : never) extends (k: infer U) => void ? U : never;

/** Extracts the type of the 'this' parameter of a function type, or 'unknown' if the function type has no 'this' parameter. */
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown;

/** Removes the 'this' parameter from a function type. */
type OmitThisParameter<T> =
	unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;

/** Given an object `T`, returns a unioned type of all non-readonly property names. */
type WritablePropertyNames<T> = {
	[K in keyof T]-?: T[K] extends Callback
		? never
		: (<F>() => F extends { [Q in K]: T[K] } ? 1 : 2) extends <F>() => F extends {
					-readonly [Q in K]: T[K];
			  }
					? 1
					: 2
			? K
			: never;
}[keyof T];

/** Given an object `T`, returns an object with readonly fields filtered out. */
type WritableProperties<T> = Pick<T, WritablePropertyNames<T>>;

/** Given an Instance `T`, returns a unioned type of all property names. */
type InstancePropertyNames<T extends Instance> = Exclude<
	ExcludeKeys<T, RBXScriptSignal | Callback | symbol>,
	"Changed"
>;

/** Given an Instance `T`, returns a unioned type of all method names. */
type InstanceMethodNames<T extends Instance> = ExtractKeys<T, Callback>;

/** Given an Instance `T`, returns a unioned type of all event names. */
type InstanceEventNames<T extends Instance> = ExtractKeys<T, RBXScriptSignal>;

/** Given an Instance `T`, returns an object with only properties. */
type InstanceProperties<T extends Instance> = Pick<T, InstancePropertyNames<T>>;

/** Given an Instance `T`, returns an object with only methods. */
type InstanceMethods<T extends Instance> = Pick<T, InstanceMethodNames<T>>;

/** Given an Instance `T`, returns an object with only events. */
type InstanceEvents<T extends Instance> = Pick<T, InstanceEventNames<T>>;

/** Given an Instance `T`, returns an object with readonly fields, methods, and events filtered out. */
type WritableInstanceProperties<T extends Instance> = WritableProperties<InstanceProperties<T>>;

/** Returns a union of all the keys of T which do not start with `_nominal_` */
type ExcludeNominalKeys<T> = {
	[K in keyof T]-?: K extends `_nominal_${infer _U}` ? never : K;
}[keyof T];

/** Returns a new object type of all the keys of T which do not start with `_nominal_` */
type ExcludeNominalMembers<T> = Pick<T, ExcludeNominalKeys<T>>;

/** Unwraps a Promise<T> */
type Awaited<T> = T extends undefined
	? T // special case for `undefined` when not in `--strictNullChecks` mode
	: T extends object & { then(successHandler: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
		? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
			? Awaited<V> // recursively unwrap the value
			: never // the argument to `then` was not callable
		: T; // non-object or non-thenable
