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
                booking_data.save().then(async data =>
                {
                    await $this.updateSlotById(req_body.slot_id, 'Booked');

                    return res.status(200).send({
                        status: 200,
                        message: "Slots Booked successfully !",
                        data: `Booking Id: ${data}`
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

    async update(req, res)
    {
        const slot_id = req.body.id;

        BookingLog.findOneAndUpdate({ id: slot_id },
            {
                $set: {
                    "out_time": new Date().getTime(),
                }
            }, {
            upsert: false,
            new: true
        }
        ).then(async data =>
        {
            const booked_lot = data.lot_id;
            await $this.updateSlotById(booked_lot, 'Available');

            return res.status(200).send({
                status: "Success",
                message: `Successfully logout!`,
            }).end();
        }).catch(err =>
        {
            return res.status(400).send({
                status: "Error",
                message: `Something went wrong, Try Again!`,
                data: err
            }).end();
        })


    }
}

const $this = Booking.prototype;
module.exports = Booking;