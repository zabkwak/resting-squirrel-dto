# resting-squirrel-dto
DTO helper for [resting-squirrel](https://www.npmjs.com/package/resting-squirrel).  
The fields and params can be defined with decorators on properties. The properties can define type and description of the `Field` and required flag for the `Param`.

## Installation
```bash
npm install resting-squirrel-dto --save
```

## Usage
### Javascript
```javascript
import rs from 'resting-squirrel'; // peer dependency

import RSDto from 'resting-squirrel-dto';

import MyCoolModel from './my-cool-model';

class User extends MyCoolModel {

	@RSDto.integer
	@RSDto.response
	@RSDto.description('ID')
	id;

	@RSDto.string
	@RSDto.required
	@RSDto.description('Name')
	name;

	@RSDto.string
	@RSDto.param
	@RSDto.description('Param only')
	param;

	@RSDto.string
	@RSDto.param
	@RSDto.response
	@RSDto.description('Both')
	both;
}

const app = rs();

app.post(0, '/user', {
	description: 'Creates new user',
	params: User.toParams(),
	response: User.toFields(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.start();
```
### Typescript
```typescript
import rs, { IRequest } from 'resting-squirrel'; // peer dependency

import RSDto, { IRSDto } from 'resting-squirrel-dto';

import MyCoolModel from './my-cool-model';

class User extends MyCoolModel implements IRSDto {

	@RSDto.integer
	@RSDto.response
	@RSDto.description('ID')
	public id: number;

	@RSDto.string
	@RSDto.required
	@RSDto.description('Name')
	public name: string;

	@RSDto.string
	@RSDto.param
	@RSDto.description('Param only')
	public param: string;

	@RSDto.string
	@RSDto.param
	@RSDto.response
	@RSDto.description('Both')
	public both: string;
}

const app = rs();

app.post<IRequest<{}, {}, User>>(0, '/user', {
	description: 'Creates new user',
	params: User.toParams(),
	response: User.toFields(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.start();
```

## Legacy usage
### Javascript
```javascript
import rs from 'resting-squirrel'; // peer dependency

import { RequestDto, ResponseDto, BaseDto } from 'resting-squirrel-dto';

class UserRequestDto extends RequestDto {

	@RequestDto.string
	@RequestDto.required
	@RequestDto.description('First name of the user')
	firstName;

	@RequestDto.string
	@RequestDto.required
	@RequestDto.description('Last name of the user')
	lastName;
}

class UserResponseDto extends ResponseDto {

	@ResponseDto.integer
	@ResponseDto.description('Identifier of the user')
	id;

	@ResponseDto.string
	@ResponseDto.description('First name of the user')
	firstName;

	@ResponseDto.string
	@ResponseDto.description('Last name of the user')
	lastName;
}

class UserDto extends RSDto {

	@BaseDto.integer
	@BaseDto.response
	@BaseDto.description('ID')
	id;

	@BaseDto.string
	@BaseDto.required
	@BaseDto.description('Name')
	name;

	@BaseDto.string
	@BaseDto.param
	@BaseDto.description('Param only')
	param;

	@BaseDto.string
	@BaseDto.param
	@BaseDto.response
	@BaseDto.description('Both')
	both;
}

const app = rs();

app.post(0, '/user', {
	description: 'Creates new user',
	params: UserRequestDto.toArray(),
	response: UserResponseDto.toArray(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.post(1, '/user', {
	description: 'Creates new user',
	params: UserDto.toParams(),
	response: UserDto.toFields(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.start();

```

### Typescript
```typescript
import rs, { IRequest } from 'resting-squirrel'; // peer dependency

import { RequestDto, ResponseDto, BaseDto } from 'resting-squirrel-dto';

class UserRequestDto extends RequestDto {

	@RequestDto.string
	@RequestDto.required
	@RequestDto.description('First name of the user')
	public firstName: string;

	@RequestDto.string
	@RequestDto.required
	@RequestDto.description('Last name of the user')
	public lastName: string;
}

class UserResponseDto extends ResponseDto {

	@ResponseDto.integer
	@ResponseDto.description('Identifier of the user')
	public id: number;

	@ResponseDto.string
	@ResponseDto.description('First name of the user')
	public firstName: string;

	@ResponseDto.string
	@ResponseDto.description('Last name of the user')
	public lastName: string;
}

class UserDto extends RSDto {

	@BaseDto.integer
	@BaseDto.response
	@BaseDto.description('ID')
	public id: number;

	@BaseDto.string
	@BaseDto.required
	@BaseDto.description('Name')
	public name: string;

	@BaseDto.string
	@BaseDto.param
	@BaseDto.description('Param only')
	public param: string;

	@BaseDto.string
	@BaseDto.param
	@BaseDto.response
	@BaseDto.description('Both')
	public both: string;
}

const app = rs();

app.post<IRequest<{}, {}, UserRequestDto>>(0, '/user', {
	description: 'Creates new user',
	params: UserRequestDto.toArray(),
	response: UserResponseDto.toArray(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.post(1, '/user', {
	description: 'Creates new user',
	params: UserDto.toParams(),
	response: UserDto.toFields(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.start();

```

## Classes
### RSDto (default export)
Class with static methods to convert the classes.
### BaseDto
Base DTO for use unified definition. It can define params and response properties.
#### Methods
##### `toResponse`
Converts the DTO response properties to the `Field` array to define response in the endpoint.
##### `toParams`
Converts the DTO param properties to the `Param` array to define params in the endpoint.
##### `static toResponse`
Calls `toResponse` on the instance.
##### `static toParams`
Calls `toParams` on the instance.
#### Decorators
##### `type(type: Type.Type | typeof BaseDto)`
Defines the property as a type from [runtime-type](https://www.npmjs.com/package/runtime-type) or another DTO class as a `Field.Shape`.
##### `arrayOf(type: Type.Type | typeof BaseDto)`
Defines the property as an array of type from [runtime-type](https://www.npmjs.com/package/runtime-type) or another DTO class a `Field.ShapeArray`.
##### `description`
Defines the description to the property.
#### `param`
Defines the property as parameter.
#### `response`
Defines the property as response.
##### `integer`
Defines the property as an integer.
##### `string`
Defines the property as a string.
##### `float`
Defines the property as a float.
##### `date`
Defines the property as a date.
##### `boolean`
Defines the property as a boolean.
##### `object`
Defines the property as an object.
##### `any`
Defines the property as an any.
##### `enum(...values: Array<string>)`
Defines the property as an enum.
##### `shape(shape: typeof BaseDto)`
Defines the property as a shape.
### ResponseDto
DTO for response only definition.
#### Methods
##### `toArray`
Converts the DTO to the `Field` array to define response in the endpoint.
##### `static toArray`
Calls `toArray` on the instance.
#### Decorators
##### `type(type: Type.Type | typeof BaseDto)`
Defines the property as a type from [runtime-type](https://www.npmjs.com/package/runtime-type) or another DTO class as a `Field.Shape`.
##### `arrayOf(type: Type.Type | typeof BaseDto)`
Defines the property as an array of type from [runtime-type](https://www.npmjs.com/package/runtime-type) or another DTO class a `Field.ShapeArray`.
##### `description`
Defines the description to the property.
##### `integer`
Defines the property as an integer.
##### `string`
Defines the property as a string.
##### `float`
Defines the property as a float.
##### `date`
Defines the property as a date.
##### `boolean`
Defines the property as a boolean.
##### `object`
Defines the property as an object.
##### `any`
Defines the property as an any.
##### `enum(...values: Array<string>)`
Defines the property as an enum.
##### `shape(shape: typeof BaseDto)`
Defines the property as a shape.
### ArgsDto
DTO for args definition. It just extends ResponseDto.
### RequestDTo
DTO for request params definition. 
#### Methods
##### `toArray`
Converts the DTO to the `Param` array to define response in the endpoint.
##### `static toArray`
Calls `toArray` on the instance.
#### Decorators
##### `type(type: Type.Type | typeof BaseDto)`
Defines the property as a type from [runtime-type](https://www.npmjs.com/package/runtime-type) or another DTO class as a `Param.Shape`.
##### `arrayOf(type: Type.Type | typeof BaseDto)`
Defines the property as an array of type from [runtime-type](https://www.npmjs.com/package/runtime-type) or another DTO class a `Param.ShapeArray`.
##### `description`
Defines the description to the property.
##### `required`
Defines the property as required.
##### `integer`
Defines the property as an integer.
##### `string`
Defines the property as a string.
##### `float`
Defines the property as a float.
##### `date`
Defines the property as a date.
##### `boolean`
Defines the property as a boolean.
##### `any`
Defines the property as an any.
##### `enum(...values: Array<string>)`
Defines the property as an enum.
##### `shape(shape: typeof BaseDto)`
Defines the property as a shape.

## Migration to v2
V2 is removing the dependency on the extending base dto class. Every class can be used as the DTO.  
All default imports of the module should be replaced with the `BaseDto` class export for same functionality.
```javascript
// v1
import RSDto from 'resting-squirrel-dto';
// v2
import { RSDto } from 'resting-squirrel-dto';

export default class UserDto extends RSDto { }
```
No other extra actions needed.

## Thanks
- [misablaha](https://github.com/misablaha) for the idea.