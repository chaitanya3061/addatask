const request = require('supertest');
const app = require('../index'); 
const expect = require('chai').expect;
describe('Facility Booking API', () => {
  let server;
  before((done) => {
    server = app.listen(done);
  });
  after((done) => {
    server.close(done);
  });
  it('sucess', async () => {
    const response = await request(server)
      .post('/bookFacility')
      .send({
        facility: 'Clubhouse',
        date: '2023-07-21',
        startTime: '16:00',
        endTime: '22:00',
      });

    const data = response.body;
    expect(response.statusCode).to.equal(200);
    expect(data).to.have.property('success').to.equal(true);
    expect(data).to.have.property('amount').to.equal(300);
  });

  it('failure', async () => {
    await request(server)
      .post('/bookFacility')
      .send({
        facility: 'Clubhouse',
        date: '2023-07-21',
        startTime: '16:00',
        endTime: '22:00',
      });

    const response = await request(server)
      .post('/bookFacility')
      .send({
        facility: 'Clubhouse',
        date: '2023-07-21',
        startTime: '18:00',
        endTime: '20:00',
      });

    const data = response.body;
    expect(response.statusCode).to.equal(200);
    expect(data).to.have.property('success').to.equal(false);
    expect(data).to.have.property('message').to.equal('BookingFailed!');
  });
});
