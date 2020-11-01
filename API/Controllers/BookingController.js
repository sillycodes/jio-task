const Parking = require("./ParkingController");
const BookingLog = require('../Models/BookingLogModel').BookingLog;
class Booking extends Parking
{
    constructor()
    {
        super();
    }

    async create(req, res)
    {

        try {
            const req_body = req.body;
            const user_dtls = req_body.user;
            const getSlotDetls = await $this.getSlotById(req_body.slot_id);

            if (getSlotDetls.current_status === 'Available') {

                const booking_data = new BookingLog({
                    lot_id: getSlotDetls.id,
                    user_id: user_dtls.id,
                    in_time: new Date().getTime(),
                    out_time: null,
                });
                booking_data.save().then( async data =>
                {
                    const getSlotDetls = await $this.updateSlotById(req_body.slot_id, 'Booked');

                    return res.status(200).send({
                        status: 200,
                        message: "Operation Completed",
                        data: data
                    }).end();

                }).catch(err =>
                {
                    throw new Error(`Unable to book parking lot-${err}`)
                })

            } else {
                throw new Error('Opps! Lot has been booked, please try again.');
            }


        } catch (err) {
            return res.status(400).send({
                status: "Error",
                message: `Unable to book lot area, Err:${err}`,
            }).end();
        }

    }

    async update(req, res){
        return res.status(400).send({
            status: "Error",
            message: `Unable to book lot area, Err:${err}`,
        }).end();
    }
}

const $this = Booking.prototype;
module.exports = Booking;