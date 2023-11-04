const request = require("supertest");
const expect = require("chai").expect;
const app = require("./server"); // Import your app

describe("GET /orders", () => {
    it("should get all orders", (done) => {
        request(app)
            .get("/orders")
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });
});

describe("POST /orders", () => {
    it("should create a new order", (done) => {
        const order = { item: "Burger", quantity: 2 };
        request(app)
            .post("/orders")
            .send(order)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("id");
                expect(res.body.item).to.equal(order.item);
                expect(res.body.quantity).to.equal(order.quantity);
                done();
            });
    });
});
