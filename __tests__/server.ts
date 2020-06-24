import { expect } from 'chai';
import rs, { IRequest } from 'resting-squirrel';
import RSConnector from 'resting-squirrel-connector';

import RSDto from '../src';
import { IRSDto } from '../src';

class UserRequestDto implements IRSDto {

	@RSDto.string
	@RSDto.required
	@RSDto.description('First name of the user')
	public firstName: string;

	@RSDto.string
	@RSDto.required
	@RSDto.description('Last name of the user')
	public lastName: string;
}

// tslint:disable-next-line: max-classes-per-file
class UserResponseDto implements IRSDto {

	@RSDto.integer
	@RSDto.description('Identifier of the user')
	public id: string;

	@RSDto.string
	@RSDto.description('First name of the user')
	public firstName: string;

	@RSDto.string
	@RSDto.description('Last name of the user')
	public lastName: string;
}

const app = rs({
	log: false,
});

app.put<IRequest<{}, {}, UserRequestDto>>(0, '/user', {
	description: 'Creates new user',
	params: RSDto.toParams(UserRequestDto),
	response: RSDto.toResponse(UserResponseDto),
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
