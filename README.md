# resting-squirrel-dto
DTO helper for [resting-squirrel](https://www.npmjs.com/package/resting-squirrel).  
The fields and params can be defined with the extended DTO class with defined properties. The properties can define type and description of the `Field` and required flag for the `Param` using decorators.

## Installation
```bash
npm install resting-squirrel-dto --save
```

## Usage
### Javascript
```javascript
import rs from 'resting-squirrel'; // peer dependency

import { RequestDto, ResponseDto } from 'resting-squirrel-dto';

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

const app = rs();

app.put(0, '/user', {
	description: 'Creates new user',
	params: UserRequestDto.toArray(),
	response: UserResponseDto.toArray(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.start();

```

### Typescript
```typescript
import rs, { IRequest } from 'resting-squirrel'; // peer dependency

import { RequestDto, ResponseDto } from 'resting-squirrel-dto';

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

const app = rs();

app.put<IRequest<{}, {}, UserRequestDto>>(0, '/user', {
	description: 'Creates new user',
	params: UserRequestDto.toArray(),
	response: UserResponseDto.toArray(),
}, async ({ body }) => {
	return somehowCreateUser(body);
});

app.start();

```

## Classes
### ResponseDto
DTO for response definition.
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
##### `any`
Defines the property as an any.
##### `enum(...values: Array<string>)`
Defines the property as an enum.
##### `shape(shape: typeof BaseDto)`
Defines the property as a shape.
### ArgsDto
DTO for args definition. It just extends ResponseDto.
### RequestDTo
DTO for request definition. 
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

## Thanks
- [misablaha](https://github.com/misablaha) for the idea.