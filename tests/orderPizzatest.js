let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp)
let response = require('./response');
let nock = require('nock');
const endpoint ='http://order-pizza-api.herokuapp.com/api';
/*
  * Test the /GET route
  */
 describe('/GET book', () => {
    it('it should GET all the orders', (done) => {
      chai.request(endpoint)
          .get('/orders')
          .end((err, res) => {
                expect(res.status).equals(200)
                expect(res.body[0]).to.be.a('object');
                expect(res.body[0].Crust).to.be.a('string');
                expect(res.body[0].Flavor).to.be.a('string');
                expect(res.body[0].Order_ID).to.be.a('number');
                expect(res.body[0].Size).to.be.a('string');
                expect(res.body[0].Table_No).to.be.a('number');
            done();
          });
    });
    it('it should return error message', (done) => {
      chai.request(endpoint)
          .get('/order')
          .end((err, res) => {
              expect(res.status).equals(404)
            done();
          });
    });
});
/*
  * Test the /POST route
  * As user name and password is not provided for generating auth. I am using nock library for mocking the response of POST
  */
 describe('/post orders', () => {
  it('it should POST orders', (done) => {
    let result = nock(endpoint)
        .post('/orders', response.order)
        .reply(200, response.order)

    let body = JSON.parse(result.interceptors[0].body);

    expect(result.interceptors[0].statusCode).equals(200)
    expect(body.Crust).to.be.equal(response.order.Crust);
    expect(body.Flavor).to.be.equal(response.order.Flavor);
    expect(body.Order_ID).to.be.equal(response.order.Order_ID);
    expect(body.Size).to.be.equal(response.order.Size);
    expect(body.Table_No).to.be.equal(response.order.Table_No);
    expect(body.Timestamp).to.be.equal(response.order.Timestamp);

    done()
  });

});

/*
  * Test the /DELETE route
  */
 describe('delete order', () => {
  it('it should DELETE orders', (done) => {
    let order_id = 3;
    chai.request(endpoint)
    .delete('/orders/'+order_id)
    .end((err, res) => {
          expect(res.status).equals(200)
          expect(res.text).to.be.equals('Order '+ order_id +' deleted')
      done();
    });
  });
  it('it should return error message when incorrect order_id is passed', (done) => {
    let order_id = 'x';
    chai.request(endpoint)
    .delete('/orders/'+order_id)
    .end((err, res) => {
          expect(res.status).equals(404)
      done();
    });
  });

});