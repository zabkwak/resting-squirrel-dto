import { expect } from 'chai';
import rs, { IRequest } from 'resting-squirrel';
import RSConnector from 'resting-squirrel-connector';

import { RequestDto, ResponseDto } from '../src';

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

// tslint:disable-next-line: max-classes-per-file
class UserResponseDto extends ResponseDto {

	@ResponseDto.integer
	@ResponseDto.description('Identifier of the user')
	public id: string;

	@ResponseDto.string
	@ResponseDto.description('First name of the user')
	public firstName: string;

	@ResponseDto.string
	@ResponseDto.description('Last name of the user')
	public lastName: string;
}

const app = rs({
	log: false,
});

app.put<IRequest<{}, {}, UserRequestDto>>(0, '/user', {
	description: 'Creates new user',
	params: UserRequestDto.toArray(),
	response: UserResponseDto.toArray(),
}, async ({ body }) => {
	return {
		id: 1,
		...body,
	};
});

const api = RSConnector({ url: 'http://localhost:8080' });

describe('Server process', () => {

	it('starts the server', (done) => app.start(done));

	it('calls the endpoint', async () => {
		const { data, statusCode } = await api.v(0).put('/user', { firstName: 'Test', lastName: 'Mocha' });
		expect(statusCode).to.be.equal(200);
		expect(data).to.have.all.keys(['id', 'firstName', 'lastName']);
		const { id, firstName, lastName } = data;
		expect(id).to.be.equal(1);
		expect(firstName).to.be.equal('Test');
		expect(lastName).to.be.equal('Mocha');
	});

	it('stops the server', (done) => app.stop(done));
});
