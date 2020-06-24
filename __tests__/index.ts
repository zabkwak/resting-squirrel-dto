import { expect } from 'chai';
import { Field, Param, Type } from 'resting-squirrel';

import RSDto, { IRSDto } from '../src';

class NestedShapeResponseDto implements IRSDto {

	@RSDto.string
	@RSDto.description('Nested shape test property')
	public test: string;
}

// tslint:disable-next-line: max-classes-per-file
class ShapeResponseDto implements IRSDto {

	@RSDto.string
	@RSDto.description('Shape test property')
	public test: string;

	@RSDto.shape(NestedShapeResponseDto)
	@RSDto.description('Nested shape property')
	public shape: NestedShapeResponseDto;
}

// tslint:disable-next-line: max-classes-per-file
class ShapeArrayResponseDto implements IRSDto {

	@RSDto.string
	@RSDto.description('Shape array test property')
	public test: string;
}

// tslint:disable-next-line: max-classes-per-file
class TestResponseDto implements IRSDto {

	@RSDto.string
	@RSDto.description('Test property')
	public test: string;

	@RSDto.shape(ShapeResponseDto)
	@RSDto.description('Shape property')
	public shape: ShapeResponseDto;

	@RSDto.arrayOf(ShapeArrayResponseDto)
	@RSDto.description('Shape array property')
	public shapeArray: Array<ShapeArrayResponseDto>;
}

// tslint:disable-next-line: max-classes-per-file
class TestRequestShapeDto implements IRSDto {

	@RSDto.string
	@RSDto.required
	@RSDto.description('Test')
	public test: string;

	@RSDto.boolean
	public boolean: boolean;
}

// tslint:disable-next-line: max-classes-per-file
class TestRequestDto implements IRSDto {

	@RSDto.string
	@RSDto.description('Test property')
	@RSDto.required
	public test: string;

	@RSDto.string
	@RSDto.description('Optional property')
	public optional: string;

	@RSDto.shape(TestRequestShapeDto)
	public shape: TestRequestShapeDto;

	@RSDto.arrayOf(Type.string)
	public array: Array<string>;

	@RSDto.enum('baf', 'lek')
	@RSDto.required
	public enum: 'baf' | 'lek';

	// public noDecorators: any;
}

// tslint:disable-next-line: max-classes-per-file
class BaseClass {

	public someParam: string = 'something';
}

// tslint:disable-next-line: max-classes-per-file
class TestDto extends BaseClass implements IRSDto {

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

	@RSDto.shape(TestRequestShapeDto)
	@RSDto.required
	public shape: TestRequestShapeDto;

	public baf: string = 'test';

	constructor(baf: string) {
		super();
	}
}

describe('Decorators', () => {

	it('checks the generated properties', () => {
		expect(RSDto.toResponse(TestResponseDto)).to.be.deep.equal([
			new Field('test', Type.string, 'Test property'),
			new Field.Shape(
				'shape',
				'Shape property',
				new Field('test', Type.string, 'Shape test property'),
				new Field.Shape('shape', 'Nested shape property', new Field('test', Type.string, 'Nested shape test property')),
			),
			new Field.ShapeArray(
				'shapeArray', 'Shape array property', new Field('test', Type.string, 'Shape array test property',
			)),
		]);

		expect(RSDto.toParams(TestRequestDto)).to.be.deep.equal([
			new Param('test', true, Type.string, 'Test property'),
			new Param('optional', false, Type.string, 'Optional property'),
			new Param.Shape(
				'shape',
				false,
				'',
				new Param('test', true, Type.string, 'Test'),
				new Param('boolean', false, Type.boolean, ''),
			),
			new Param('array', false, Type.arrayOf(Type.string), ''),
			new Param('enum', true, Type.enum_('baf', 'lek'), ''),
			// new Param('noDecorators', false, Type.any, ''),
		]);
	});

	it('checks the unified dto', () => {
		expect(RSDto.toParams(TestDto)).to.be.deep.equal([
			new Param('name', true, Type.string, 'Name'),
			new Param('param', false, Type.string, 'Param only'),
			new Param('both', false, Type.string, 'Both'),
			new Param.Shape(
				'shape',
				true,
				'',
				new Param('test', true, Type.string, 'Test'),
				new Param('boolean', false, Type.boolean, ''),
			),
		]);
		expect(RSDto.toResponse(TestDto)).to.be.deep.equal([
			new Field('id', Type.integer, 'ID'),
			new Field('name', Type.string, 'Name'),
			new Field('both', Type.string, 'Both'),
			new Field.Shape(
				'shape',
				'',
				new Field('test', Type.string, 'Test'),
				new Field('boolean', Type.boolean, ''),
			),
		]);
	});

	it('checks the optional parameters override', () => {
		expect(RSDto.toParams(TestDto, ['name', 'shape'])).to.be.deep.equal([
			new Param('name', false, Type.string, 'Name'),
			new Param('param', false, Type.string, 'Param only'),
			new Param('both', false, Type.string, 'Both'),
			new Param.Shape(
				'shape',
				false,
				'',
				new Param('test', true, Type.string, 'Test'),
				new Param('boolean', false, Type.boolean, ''),
			),
		]);
		expect(RSDto.toParams(TestDto, ['name', 'shape.test'])).to.be.deep.equal([
			new Param('name', false, Type.string, 'Name'),
			new Param('param', false, Type.string, 'Param only'),
			new Param('both', false, Type.string, 'Both'),
			// Doesn't make any sense but for testing :)
			new Param.Shape(
				'shape',
				true,
				'',
				new Param('test', false, Type.string, 'Test'),
				new Param('boolean', false, Type.boolean, ''),
			),
		]);
	});

	it('checks the omit override', () => {
		expect(RSDto.toParams(TestDto, undefined, ['both'])).to.be.deep.equal([
			new Param('name', true, Type.string, 'Name'),
			new Param('param', false, Type.string, 'Param only'),
			new Param.Shape(
				'shape',
				true,
				'',
				new Param('test', true, Type.string, 'Test'),
				new Param('boolean', false, Type.boolean, ''),
			),
		]);
		expect(RSDto.toParams(TestDto, undefined, ['shape.test'])).to.be.deep.equal([
			new Param('name', true, Type.string, 'Name'),
			new Param('param', false, Type.string, 'Param only'),
			new Param('both', false, Type.string, 'Both'),
			new Param.Shape(
				'shape',
				true,
				'',
				new Param('boolean', false, Type.boolean, ''),
			),
		]);
		expect(RSDto.toResponse(TestDto, ['shape'])).to.be.deep.equal([
			new Field('id', Type.integer, 'ID'),
			new Field('name', Type.string, 'Name'),
			new Field('both', Type.string, 'Both'),
		]);
	});
});
