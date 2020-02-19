import { expect } from 'chai';
import { Field, Param, Type } from 'resting-squirrel';

import { RequestDto, ResponseDto } from '../src';

class NestedShapeResponseDto extends ResponseDto {

	@ResponseDto.string
	@ResponseDto.description('Nested shape test property')
	public test: string;
}

// tslint:disable-next-line: max-classes-per-file
class ShapeResponseDto extends ResponseDto {

	@ResponseDto.string
	@ResponseDto.description('Shape test property')
	public test: string;

	@ResponseDto.shape(NestedShapeResponseDto)
	@ResponseDto.description('Nested shape property')
	public shape: NestedShapeResponseDto;
}

// tslint:disable-next-line: max-classes-per-file
class ShapeArrayResponseDto extends ResponseDto {

	@ResponseDto.string
	@ResponseDto.description('Shape array test property')
	public test: string;
}

// tslint:disable-next-line: max-classes-per-file
class TestResponseDto extends ResponseDto {

	@ResponseDto.string
	@ResponseDto.description('Test property')
	public test: string;

	@ResponseDto.shape(ShapeResponseDto)
	@ResponseDto.description('Shape property')
	public shape: ShapeResponseDto;

	@ResponseDto.arrayOf(ShapeArrayResponseDto)
	@ResponseDto.description('Shape array property')
	public shapeArray: Array<ShapeArrayResponseDto>;
}

// tslint:disable-next-line: max-classes-per-file
class TestRequestShapeDto extends RequestDto {

	@RequestDto.string
	@RequestDto.required
	@RequestDto.description('Test')
	public test: string;

	@RequestDto.boolean
	public boolean: boolean;
}

// tslint:disable-next-line: max-classes-per-file
class TestRequestDto extends RequestDto {

	@RequestDto.string
	@RequestDto.description('Test property')
	@RequestDto.required
	public test: string;

	@RequestDto.string
	@RequestDto.description('Optional property')
	public optional: string;

	@RequestDto.shape(TestRequestShapeDto)
	public shape: TestRequestShapeDto;

	@RequestDto.arrayOf(Type.string)
	public array: Array<string>;

	@RequestDto.enum('baf', 'lek')
	@RequestDto.required
	public enum: 'baf' | 'lek';

	// public noDecorators: any;
}


describe('Decorators', () => {

	it('checks the generated properties', () => {
		expect(TestResponseDto.toArray()).to.be.deep.equal([
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

		expect(TestRequestDto.toArray()).to.be.deep.equal([
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
});
